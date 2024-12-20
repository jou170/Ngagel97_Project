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
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

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
      <DialogTitle>Order Detail</DialogTitle>
      <DialogContent ref={previewRef}>
        {order && (
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              {`Tanggal Transaksi: ${formattedDate}`}
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {`Order ID: ${order._id}`}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
              sx={{ marginTop: "20px" }}
            >
              Download PDF
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailOrder;