"use client";

import React, { useRef } from "react";
import { Box, Typography, Button, Divider, Dialog, DialogTitle, DialogContent } from "@mui/material";
import jsPDF from "jspdf";
import { format } from "date-fns";

const DetailOfflineOrder = ({ order, onClose }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margins = 20;
    let yPosition = margins + 15;
  
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
  
    const checkNewPage = (height) => {
      if (yPosition + height > pageHeight - margins) {
        pdf.addPage();
        yPosition = margins;
        return true;
      }
      return false;
    };
  
    const addStyledBox = (text, options = {}) => {
      const {
        x = margins,
        width = pageWidth - (margins * 2),
        padding = 3,
        backgroundColor = '#f5f5f5',
        textColor = '#000000',
        fontSize = 10,
        isBold = false,
        align = 'left',
        addDivider = false,
        dividerWidth = null,
        dividerColor = '#cccccc' // New option for divider color
      } = options;
  
      checkNewPage(padding * 2 + 8);
      
      const rgb = hexToRgb(backgroundColor);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      pdf.rect(x, yPosition, width, padding * 2 + 6, 'F');
      
      if (addDivider) {
        const divRgb = hexToRgb(dividerColor);
        pdf.setDrawColor(divRgb.r, divRgb.g, divRgb.b);
        const lineWidth = dividerWidth || width;
        const lineX = x + ((width - lineWidth) / 2);
        pdf.setLineWidth(0.2); // Thinner line
        pdf.line(lineX, yPosition + padding * 2 + 6, lineX + lineWidth, yPosition + padding * 2 + 6);
      }
      
      pdf.setFontSize(fontSize);
      const textRgb = hexToRgb(textColor);
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = pdf.splitTextToSize(text, width - (padding * 2));
      const textX = align === 'center' ? pageWidth / 2 : 
                   align === 'right' ? x + width - padding : 
                   x + padding;
      pdf.text(lines, textX, yPosition + padding + 4, { align });
      
      const height = (lines.length * fontSize * 0.3528) + (padding * 2);
      yPosition += height;
      return height;
    };

    try {
      const logoWidth = 20;
      const logoHeight = 20;
      pdf.addImage('/image/Ngagel97Logo.png', 'PNG', margins, margins, logoWidth, logoHeight);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  
    // Header
    addStyledBox("Toko Print Ngagel97", {
      fontSize: 16,
      isBold: true,
      textColor: '#1a237e',
      backgroundColor: '#ffffff',
      align: 'center'
    });
  
    addStyledBox(
      "Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng,\nSurabaya, Jawa Timur 60284\nContact: (031) 5027852",
      {
        fontSize: 10,
        backgroundColor: '#ffffff',
        align: 'center'
      }
    );
  
    yPosition += 5;
  
    // Order details
    const formattedDate = format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm");
    
    addStyledBox(`Order ID: ${order.idTransaksi}`, {
      fontSize: 12,
      isBold: true,
      backgroundColor: '#ffffff',
      align: 'center'
    });
  
    addStyledBox(`Tanggal Transaksi: ${formattedDate}`, {
      backgroundColor: '#ffffff',
      align: 'center'
    });
  
    addStyledBox(`Status: ${order.status}`, {
      backgroundColor: '#e3f2fd',
      align: 'center'
    });
  
    // Notes section
    if (order.notes) {
      yPosition += 5;
      addStyledBox("Notes:", {
        isBold: true,
        backgroundColor: '#fff3e0'
      });
      addStyledBox(order.notes, {
        backgroundColor: '#fff3e0'
      });
    }
  
    // Items sections
    const renderItems = (items, title, isJasa = false) => {
      if (items?.length > 0) {
        yPosition += 10;
        addStyledBox(title, {
          fontSize: 12,
          isBold: true,
          textColor: '#1a237e',
          backgroundColor: '#ffffff'
        });
    
        items.forEach((item, itemIndex) => {
          const subtotal = item.lembar ? 
            item.harga * item.lembar * item.qty : 
            item.harga * item.qty;
    
          addStyledBox(
            `${item.nama} | ${item.lembar ? item.lembar : item.qty} ${item.lembar ? "lembar" : "x"}`,
            {
              isBold: true,
              textColor: '#1a237e',
              backgroundColor: '#f8f9fa',
              addDivider: itemIndex < items.length - 1 // Add divider between items
            }
          );
          
          addStyledBox(
            `Rp${item.harga.toLocaleString()} @${item.lembar ? "lembar" : "barang"} | Subtotal: Rp${subtotal.toLocaleString()}`,
            {
              backgroundColor: '#f8f9fa',
              addDivider: false
            }
          );
    
          if (isJasa && item.addOns?.length > 0) {
            yPosition += 3;
            
            addStyledBox("Add-Ons:", {
              isBold: true,
              backgroundColor: '#e3f2fd',
              textColor: '#1a237e',
              x: margins + 10,
              width: pageWidth - (margins * 2) - 20
            });
    
            item.addOns.forEach((addOn, index) => {
              const isLastAddOn = index === item.addOns.length - 1;
              
              // Add a full-width divider before each add-on except the first one
              if (index > 0) {
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.2);
                pdf.line(
                  margins + 15, 
                  yPosition - 1,
                  pageWidth - margins - 15,
                  yPosition - 1
                );
                yPosition += 2;
              }
              
              addStyledBox(
                `${addOn.nama}`,
                {
                  x: margins + 15,
                  width: pageWidth - (margins * 2) - 30,
                  fontSize: 9,
                  isBold: true,
                  backgroundColor: '#ffffff'
                }
              );
              
              addStyledBox(
                `${addOn.qty} x | Rp${addOn.harga.toLocaleString()} | Subtotal: Rp${(addOn.harga * addOn.qty).toLocaleString()}`,
                {
                  x: margins + 15,
                  width: pageWidth - (margins * 2) - 30,
                  fontSize: 9,
                  backgroundColor: '#ffffff',
                  addDivider: !isLastAddOn,
                  dividerWidth: pageWidth - (margins * 2) - 40,
                  dividerColor: '#e0e0e0'
                }
              );
            });
            
            yPosition += 3;
          }
          yPosition += 4;
        });
      }
    };
  
    renderItems(order.barang, "Barang");
    renderItems(order.jasa, "Jasa", true);
  
    // Totals
    yPosition += 5;
    const totalTanpaOngkir = order.total - (order.ongkir || 0);
  
    addStyledBox(`Total Pembelian: Rp${totalTanpaOngkir.toLocaleString()}`, {
      backgroundColor: '#f5f5f5',
      width: pageWidth - (margins * 2),
      align: 'right'
    });
  
    if (order.ongkir) {
      addStyledBox(`Ongkir: Rp${order.ongkir.toLocaleString()}`, {
        backgroundColor: '#f5f5f5',
        width: pageWidth - (margins * 2),
        align: 'right'
      });
    }
  
    addStyledBox(`Grand Total: Rp${order.total.toLocaleString()}`, {
      fontSize: 12,
      isBold: true,
      backgroundColor: '#e3f2fd',
      textColor: '#1a237e',
      width: pageWidth - (margins * 2),
      align: 'right'
    });
  
    // Footer on each page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Terima kasih telah berbelanja di Toko Print Ngagel97 - Halaman ${i} dari ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  
    pdf.save(`Offline_Order_${order.idTransaksi}.pdf`);
  };

  // Rest of the component remains the same...
  const renderBarang = (barang) => {
    return barang.map((item, index) => {
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
        </Box>
      );
    });
  };
  
  const renderJasa = (jasa) => {
    return jasa.map((item, index) => {
      let subtotal = item.lembar ? item.harga * item.lembar * item.qty : item.harga * item.qty;
  
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
            {`${item.nama} | ${item.lembar ? item.lembar : item.qty} ${item.lembar ? "lembar" : "x"}`}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {`Rp${item.harga.toLocaleString()} @${item.lembar ? "lembar" : "barang"} | Subtotal: Rp${subtotal.toLocaleString()}`}
          </Typography>
          {item.addOns && item.addOns.length > 0 && (
            <Box sx={{ 
              marginLeft: 2, 
              marginTop: 1,
              padding: "10px",
              backgroundColor: "#e8eaf6",
              borderRadius: "4px"
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: "bold", 
                marginBottom: 1,
                color: "#1a237e"
              }}>
                Add-Ons:
              </Typography>
              <Box sx={{ padding: "0 4px" }}>{renderAddOns(item.addOns)}</Box>
            </Box>
          )}
        </Box>
      );
    });
  };

  const renderAddOns = (addOns) => {
    return addOns.map((addOn, index) => {
      const isLastItem = index === addOns.length - 1;
      let subtotal = addOn.harga * addOn.qty;
  
      return (
        <Box key={index}>
          <Box sx={{ 
            padding: "8px 0",
            backgroundColor: "#f8f9fa"
          }}>
            <Typography variant="body2" sx={{ 
              marginBottom: 0.5,
              color: "#424242",
              fontWeight: "medium"
            }}>
              {`${addOn.nama} | ${addOn.qty} x`}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666666" }}>
              {`Rp${addOn.harga.toLocaleString()} | Subtotal: Rp${subtotal.toLocaleString()}`}
            </Typography>
          </Box>
          {!isLastItem && <Divider sx={{ margin: "4px 0" }} />}
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
            <Typography variant="body1" sx={{ color: "#424242" }}>Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng,
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
                  {`Alamat: Offline Store`}
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
              
              {order.barang && order.barang.length > 0 && (
                <Box sx={{ marginTop: "20px" }}>
                  <Typography variant="h6" sx={{ 
                    marginBottom: 2,
                    color: "#1a237e",
                    fontWeight: "bold"
                  }}>
                    Barang
                  </Typography>
                  <Box>{renderBarang(order.barang)}</Box>
                </Box>
              )}
  
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
  
  export default DetailOfflineOrder;