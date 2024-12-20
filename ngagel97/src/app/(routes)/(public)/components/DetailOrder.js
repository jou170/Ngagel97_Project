"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DailySalesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const previewRef = useRef(null);

  const formatCurrency = (amount) => `Rp. ${amount.toLocaleString("id-ID")},-`;

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const todayTransactions = response.data.data.orders.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate >= startOfDay && transactionDate <= endOfDay;
      });

      setTransactions(todayTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const groupTransactionsByUser = () => {
    const grouped = transactions.reduce((acc, transaction) => {
      const userName = transaction.userId ? transaction.userId : "Offline User";
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(transaction);
      return acc;
    }, {});

    setGroupedData(grouped);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      groupTransactionsByUser();
    }
  }, [transactions]);

  const handleDownloadPDF = () => {
    const input = previewRef.current;
    const dateStr = new Date().toLocaleDateString("id-ID");

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.setFontSize(12);
        pdf.text(`Laporan Penjualan - ${dateStr}`, 10, 10);

        pdf.addImage(imgData, "PNG", 0, position + 10, imgWidth, imgHeight); // Add 10mm padding for title
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position + 10, imgWidth, imgHeight); // Add 10mm padding for title
          heightLeft -= pageHeight;
        }

        pdf.save(`sales-report-${dateStr}.pdf`);
      })
      .catch((err) => console.error("Error generating PDF:", err));
  };

  const calculateTotalSales = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.total, 0);
  };

  const totalDailySales = calculateTotalSales();
  const dateStr = new Date().toLocaleDateString("id-ID"); // Date formatted as "DD/MM/YYYY"

  // Function to render jasa (services) for each transaction
  const renderJasa = (jasa) => {
    return jasa.map((item, index) => {
      let subtotal = item.harga * item.qty;
      if (item.lembar) {
        subtotal = item.harga * item.lembar * item.qty;
      }

      return (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {`${item.nama} | ${item.lembar ? item.lembar : item.qty} ${item.lembar ? "lembar" : "x"}`}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {`Rp${item.harga.toLocaleString()} @${item.lembar ? "lembar" : "barang"} | Subtotal: Rp${subtotal.toLocaleString()}`}
          </Typography>
          {item.addOns && item.addOns.length > 0 && (
            <Box sx={{ marginLeft: 2, marginTop: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Add-Ons:
              </Typography>
              <Box sx={{ padding: 0 }}>
                {renderAddOns(item.addOns)}
              </Box>
            </Box>
          )}
        </Box>
      );
    });
  };

  // Function to render add-ons for each jasa item
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          <Box sx={{ bgcolor: "#b08968", p: 2, borderRadius: "4px 4px 0 0", textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              Laporan Penjualan Hari Ini - {dateStr}
            </Typography>
          </Box>
          <Paper sx={{ p: 3 }}>
            {Object.entries(groupedData).map(([userName, userTransactions]) => {
              const totalTransaction = userTransactions.reduce(
                (acc, transaction) => acc + transaction.total,
                0
              );

              return (
                <div key={userName}>
                  <Typography variant="h6" gutterBottom>
                    {userName}
                  </Typography>
                  {userTransactions.map((transaction) => (
                    <Box key={transaction._id} sx={{ marginBottom: 3 }}>
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {`Order ID: ${transaction._id}`}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        {`Tanggal Transaksi: ${new Date(transaction.createdAt).toLocaleDateString("id-ID")}`}
                      </Typography>
                      <Typography sx={{ marginBottom: 2 }}>
                        {`Alamat: ${transaction.alamat}`}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        {`Status: ${transaction.status}`}
                      </Typography>

                      {transaction.notes && (
                        <Box sx={{ margin: "20px 0" }}>
                          <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                            Notes:
                          </Typography>
                          <Typography variant="body2">{transaction.notes}</Typography>
                        </Box>
                      )}

                      <Divider sx={{ margin: "20px 0" }} />
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Jasa
                      </Typography>
                      <Box>{renderJasa(transaction.jasa)}</Box>

                      {transaction.addOns && transaction.addOns.length > 0 && (
                        <Box sx={{ marginTop: "20px" }}>
                          <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Add-Ons
                          </Typography>
                          <Box>{renderAddOns(transaction.addOns)}</Box>
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
                          {`Total Pembelian: Rp${(transaction.total - (transaction.ongkir || 0)).toLocaleString()}`}
                        </Typography>
                        {transaction.ongkir && (
                          <Typography sx={{ marginBottom: 1 }}>
                            {`Ongkir: Rp${transaction.ongkir.toLocaleString()}`}
                          </Typography>
                        )}
                        <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>
                          {`Grand Total: Rp${transaction.total.toLocaleString()}`}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 3,
                      textAlign: "right",
                      bgcolor: "#e0e0e0",
                      p: 2,
                      borderRadius: "4px",
                    }}
                  >
                    <strong>Total Penjualan Harian:</strong> {formatCurrency(totalTransaction)}
                  </Typography>
                </div>
              );
            })}
            <DialogActions>
              <Button onClick={() => setOpenPreview(false)} color="primary">
                Tutup
              </Button>
              <Button onClick={handleDownloadPDF} color="primary" variant="contained">
                Download PDF
              </Button>
            </DialogActions>
          </Paper>
        </Container>
      </div>
    </LocalizationProvider>
  );
};

export default DailySalesPage;
