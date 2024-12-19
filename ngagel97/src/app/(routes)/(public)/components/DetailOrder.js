"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // Render Jasa (service)
  const renderJasa = (jasa) => {
    return jasa.map((item, index) => {
      let subtotal = item.harga * item.qty;
      if (item.lembar) {
        subtotal = item.harga * item.lembar * item.qty;
      }

      return (
        <ListItem key={index}>
          <ListItemText
            primary={`${item.nama} | ${item.lembar ? item.lembar : item.qty} ${item.lembar ? "lembar" : "x"}`}
            secondary={`Rp${item.harga.toLocaleString()} @${item.lembar ? "lembar" : "barang"} | Subtotal: Rp${subtotal.toLocaleString()}`}
          />
          {/* Render Add-Ons jika ada di dalam jasa */}
          {item.addOns && item.addOns.length > 0 && (
            <Box sx={{ marginLeft: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: '8px' }}>
                Add-Ons:
              </Typography>
              <List>
                {renderAddOns(item.addOns)}
              </List>
            </Box>
          )}
        </ListItem>
      );
    });
  };

  // Render Add-Ons (additional items)
  const renderAddOns = (addOns) => {
    return addOns.map((addOn, index) => {
      let subtotal = addOn.harga * addOn.qty;

      return (
        <ListItem key={index}>
          <ListItemText
            primary={`${addOn.nama} | ${addOn.qty} x`}
            secondary={`Rp${addOn.harga.toLocaleString()} | Subtotal: Rp${subtotal.toLocaleString()}`}
          />
        </ListItem>
      );
    });
  };

  // Hitung total transaksi tanpa ongkir
  const totalTanpaOngkir = order.total - (order.ongkir || 0);

  return (
    <Dialog open={!!order} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Detail</DialogTitle>
      <DialogContent ref={previewRef}>
        {order && (
          <Box>
            <Typography variant="h6">{`Order ID: ${order.idTransaksi}`}</Typography>
            <Typography>{`User ID: ${order.userId}`}</Typography>
            <Typography>{`Address: ${order.alamat}`}</Typography>
            <Typography>{`Status: ${order.status}`}</Typography>
            <Typography>{`Total: Rp.${order.total.toLocaleString()}`}</Typography>

            {/* Tampilkan Ongkir (Shipping Cost) */}
            {order.ongkir && (
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {`Ongkir: Rp.${order.ongkir.toLocaleString()}`}
              </Typography>
            )}

            {/* Tampilkan Total Transaksi tanpa Ongkir */}
            <Typography variant="body1" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
              {`Total Tanpa Ongkir: Rp.${totalTanpaOngkir.toLocaleString()}`}
            </Typography>

            <Divider sx={{ margin: "20px 0" }} />
            <Typography variant="h6">Jasa</Typography>
            <List>{renderJasa(order.jasa)}</List>

            {/* Jika ada Add-Ons yang terpisah dari Jasa, tampilkan di sini */}
            {order.addOns && order.addOns.length > 0 && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6">Add-Ons</Typography>
                <List>{renderAddOns(order.addOns)}</List>
              </Box>
            )}

            <Divider sx={{ margin: "20px 0" }} />
            <Typography variant="body2" color="textSecondary">
              {`Created At: ${new Date(order.createdAt).toLocaleString()}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`Updated At: ${new Date(order.updatedAt).toLocaleString()}`}
            </Typography>

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
