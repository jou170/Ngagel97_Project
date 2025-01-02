"use client";

import React, { useRef } from "react";
import { Box, Typography, Button, Divider, Dialog, DialogTitle, DialogContent } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

const DetailOrder = ({ order, onClose }) => {
  const previewRef = useRef(null);
  const displayAddress = order?.alamat || "Offline Store";

  const handleDownloadPDF = async () => {
    const input = previewRef.current;
    try {
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margins = 20;

      // Calculate image dimensions while preserving aspect ratio
      const aspectRatio = canvas.width / canvas.height;
      const imgWidth = pdfWidth - (margins * 2);
      const imgHeight = imgWidth / aspectRatio;

      // Calculate if content exceeds page height
      const totalContentHeight = imgHeight + (margins * 2) + 30; // 30mm for header and footer
      const numberOfPages = Math.ceil(totalContentHeight / pdfHeight);

      // Header (on first page only)
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Toko Print Ngagel97", pdfWidth / 2, margins, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const address = "Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng,";
      const address2 = "Surabaya, Jawa Timur 60284";
      const contact = "Contact: (031) 5027852";
      pdf.text(address, pdfWidth / 2, margins + 8, { align: "center" });
      pdf.text(address2, pdfWidth / 2, margins + 13, { align: "center" });
      pdf.text(contact, pdfWidth / 2, margins + 18, { align: "center" });

      // Split image into pages if necessary
      let remainingHeight = imgHeight;
      let sourceY = 0;
      const headerHeight = 25; // Height reserved for header

      for (let i = 0; i < numberOfPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageContentHeight = Math.min(remainingHeight, pdfHeight - (margins * 2) - (i === 0 ? headerHeight : 0));
        const scaledSourceHeight = (pageContentHeight / imgHeight) * canvas.height;
        
        pdf.addImage(
          imgData,
          "PNG",
          margins,
          i === 0 ? margins + headerHeight : margins,
          imgWidth,
          imgHeight,
          null,
          'FAST',
          0,
          sourceY
        );

        remainingHeight -= pageContentHeight;
        sourceY += scaledSourceHeight;
      }

      // Add footer on the last page
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(128, 128, 128);
      const footer = "Terima kasih telah berbelanja di Toko Print Ngagel97";
      pdf.text(footer, pdfWidth / 2, pdfHeight - 10, { align: "center" });

      pdf.save(`Order_${order.idTransaksi}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const renderJasa = (jasa) => {
    return jasa.map((item, index) => {
      let subtotal = item.harga * item.qty;
      if (item.lembar) {
        subtotal = item.harga * item.lembar * item.qty;
      }

      return (
        <Box key={index} sx={{ 
          marginBottom: 2,
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px"
        }}>
          <Typography variant="body1" sx={{ 
            fontWeight: "bold", 
            marginBottom: 1,
            color: "#1a237e"
          }}>
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
            <Box sx={{ 
              marginLeft: 2, 
              marginTop: 1,
              padding: "8px",
              backgroundColor: "#ffffff",
              borderRadius: "4px"
            }}>
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
          <Typography variant="body2" sx={{ 
            marginBottom: 1,
            color: "#424242"
          }}>
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
        <Box sx={{ textAlign: "center", padding: "20px 0" }}>
          <Typography variant="h4" sx={{ 
            fontWeight: "bold",
            color: "#1a237e",
            marginBottom: 2
          }}>
            Toko Print Ngagel97
          </Typography>
          <Typography variant="body1" sx={{ color: "#424242" }}>
            Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng,
          </Typography>
          <Typography variant="body1" sx={{ color: "#424242" }}>
            Surabaya, Jawa Timur 60284
          </Typography>
          <Typography variant="body1" sx={{ color: "#424242" }}>
            Contact: (031) 5027852
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent ref={previewRef}>
        {order && (
          <Box sx={{ 
            marginBottom: 3,
            padding: "20px",
            backgroundColor: "#ffffff" 
          }}>
            <Box sx={{ 
              textAlign: "center",
              marginBottom: 4
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold",
                color: "#1a237e",
                marginBottom: 1
              }}>
                {`Order ID: ${order.idTransaksi}`}
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                {`Tanggal Transaksi: ${formattedDate}`}
              </Typography>
              <Typography variant="body1">
                {`Alamat: ${displayAddress}`}
              </Typography>
              <Typography sx={{ 
                fontWeight: "bold",
                marginTop: 2,
                backgroundColor: "#e3f2fd",
                padding: "8px",
                borderRadius: "4px",
                display: "inline-block"
              }}>
                {`Status: ${order.status}`}
              </Typography>
            </Box>

            {order.notes && (
              <Box sx={{ 
                margin: "20px 0",
                padding: "15px",
                backgroundColor: "#fff3e0",
                borderRadius: "4px"
              }}>
                <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Notes:
                </Typography>
                <Typography variant="body2">{order.notes}</Typography>
              </Box>
            )}

            <Divider sx={{ margin: "20px 0" }} />

            {order.jasa && order.jasa.length > 0 && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6" sx={{ 
                  marginBottom: 2,
                  color: "#1a237e",
                  fontWeight: "bold"
                }}>
                  Jasa
                </Typography>
                <Box>{renderJasa(order.jasa)}</Box>
              </Box>
            )}

            <Divider sx={{ margin: "20px 0" }} />
            
            <Box sx={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}>
                <Typography sx={{ marginBottom: 1 }}>
                  {`Total Pembelian: Rp${totalTanpaOngkir.toLocaleString()}`}
                </Typography>
                {order.ongkir && (
                  <Typography sx={{ marginBottom: 1 }}>
                    {`Ongkir: Rp${order.ongkir.toLocaleString()}`}
                  </Typography>
                )}
                <Typography sx={{ 
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "#1a237e",
                  marginTop: 1,
                  padding: "8px 16px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px"
                }}>
                  {`Grand Total: Rp${order.total.toLocaleString()}`}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPDF}
        sx={{ 
          margin: "20px",
          padding: "10px 20px",
          backgroundColor: "#1a237e",
          '&:hover': {
            backgroundColor: "#0d47a1"
          }
        }}
      >
        Download PDF
      </Button>
    </Dialog>
  );
};

export default DetailOrder;