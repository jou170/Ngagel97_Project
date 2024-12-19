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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DailySalesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const groupTransactionsByUser = () => {
    const grouped = transactions.reduce((acc, transaction) => {
      const user = users.find((u) => u._id === transaction.userId);
      const userName = user ? user.name : "Offline User";

      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(transaction);
      return acc;
    }, {});

    setGroupedData(grouped);
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (transactions.length > 0 && users.length > 0) {
      groupTransactionsByUser();
    }
  }, [transactions, users]);

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

        pdf.save("sales-report.pdf");
      })
      .catch((err) => console.error("Error generating PDF:", err));
  };

  const calculateTotalSales = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.total, 0);
  };

  const totalDailySales = calculateTotalSales();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          <Box sx={{ bgcolor: "#b08968", p: 2, borderRadius: "4px 4px 0 0", textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              Laporan Penjualan Hari Ini
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
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                          <TableCell>ID Transaksi</TableCell>
                          <TableCell>Tanggal</TableCell>
                          <TableCell>Ongkir</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userTransactions.map((transaction, index) => (
                          <TableRow key={index}>
                            <TableCell>{transaction._id.slice(-5)}</TableCell>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                            <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                            <TableCell>{formatCurrency(transaction.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="body1" sx={{ mt: 1, textAlign: "right" }}>
                    <strong>Total Transaksi:</strong> {formatCurrency(totalTransaction)}
                  </Typography>
                </div>
              );
            })}
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
              <strong>Total Penjualan Harian:</strong> {formatCurrency(totalDailySales)}
            </Typography>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setOpenPreview(true)}
              >
                Pratinjau PDF
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadPDF}
              >
                Unduh PDF
              </Button>
            </Box>
          </Paper>
        </Container>
        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
          <DialogTitle>Preview Laporan Penjualan</DialogTitle>
          <DialogContent>
            <div ref={previewRef} style={{ padding: "20px" }}>
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
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID Transaksi</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Ongkir</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userTransactions.map((transaction, index) => (
                            <TableRow key={index}>
                              <TableCell>{transaction._id.slice(-5)}</TableCell>
                              <TableCell>
                                {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
                              </TableCell>
                              <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                              <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                              <TableCell>{formatCurrency(transaction.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography variant="body1" sx={{ mt: 1, textAlign: "right" }}>
                      <strong>Total Transaksi:</strong> {formatCurrency(totalTransaction)}
                    </Typography>
                  </div>
                );
              })}
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
                <strong>Total Penjualan Harian:</strong> {formatCurrency(totalDailySales)}
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)} color="primary">
              Tutup
            </Button>
            <Button onClick={handleDownloadPDF} color="primary" variant="contained">
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default DailySalesPage;
