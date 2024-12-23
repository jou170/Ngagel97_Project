"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

const DetailOrder = ({ order, onClose }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = previewRef.current;
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Resize canvas image to fit into a single PDF page
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Scale image to fit the PDF page
        const aspectRatio = canvas.width / canvas.height;
        const imgWidth = pdfWidth;
        const imgHeight = pdfWidth / aspectRatio;

        // Ensure content fits entirely in one page
        const yOffset = imgHeight > pdfHeight ? 0 : (pdfHeight - imgHeight) / 2;

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Toko Print Ngagel97", pdfWidth / 2, 20, null, null, "center");

        pdf.addImage(imgData, "PNG", 0, 30 + yOffset, imgWidth, imgHeight - 30);
        pdf.save(`Order_${order.idTransaksi}.pdf`);
      })
      .catch((err) => console.error("Error generating PDF:", err));
  };

  const renderJasa = (jasa) => {
    return jasa.map((item, index) => {
      let subtotal = item.harga * item.qty;
      if (item.lembar) {
        subtotal = item.harga * item.lembar * item.qty;
      }

      return (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {`${item.nama} | ${item.lembar ? item.lembar : item.qty} ${
              item.lembar ? "lembar" : "x"
            }`}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {`Rp${item.harga.toLocaleString()} @${
              item.lembar ? "lembar" : "barang"
            } | Subtotal: Rp${subtotal.toLocaleString()}`}
          </Typography>
          {item.addOns && item.addOns.length > 0 && (
            <Box sx={{ marginLeft: 2, marginTop: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Add-Ons:
              </Typography>
              <Box sx={{ padding: 0 }}>{renderAddOns(item.addOns)}</Box>
            </Box>
          )}
        </Box>
      );
    });
  };

  const renderAddOns = (addOns) => {
    return addOns.map((addOn, index) => {
      let subtotal = addOn.harga * addOn.qty;

      return (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {`${addOn.nama} | ${addOn.qty} x`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`Rp${addOn.harga.toLocaleString()} | Subtotal: Rp${subtotal.toLocaleString()}`}
          </Typography>
        </Box>
      );
    });
  };

  const totalTanpaOngkir = order.total - (order.ongkir || 0);
  const formattedDate = format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm");

  return (
    <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Toko Print Ngagel97
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent ref={previewRef}>
        {order && (
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              {`Toko Print Ngagel97`}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {`Order ID: ${order.idTransaksi}`}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              {`Tanggal Transaksi: ${formattedDate}`}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              {`Address: ${order.alamat}`}
            </Typography>
            <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
              {`Status: ${order.status}`}
            </Typography>

            {order.notes && (
              <Box sx={{ margin: "20px 0" }}>
                <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Notes:
                </Typography>
                <Typography variant="body2">{order.notes}</Typography>
              </Box>
            )}

            <Divider sx={{ margin: "20px 0" }} />
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Jasa
            </Typography>
            <Box>{renderJasa(order.jasa)}</Box>

            {order.addOns && order.addOns.length > 0 && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Add-Ons
                </Typography>
                <Box>{renderAddOns(order.addOns)}</Box>
              </Box>
            )}

            <Divider sx={{ margin: "20px 0" }} />
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography sx={{ marginBottom: 1 }}>
                {`Total Pembelian: Rp${totalTanpaOngkir.toLocaleString()}`}
              </Typography>
              {order.ongkir && (
                <Typography sx={{ marginBottom: 1 }}>
                  {`Ongkir: Rp${order.ongkir.toLocaleString()}`}
                </Typography>
              )}
              <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
                {`Grand Total: Rp${order.total.toLocaleString()}`}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPDF}
        sx={{ marginTop: "20px" }}
      >
        Download PDF
      </Button>
    </Dialog>
  );
};

export default DetailOrder;
