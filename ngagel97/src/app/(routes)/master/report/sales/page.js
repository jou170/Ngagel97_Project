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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, MonthPicker } from "@mui/x-date-pickers";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const previewRef = useRef(null);

  const formatCurrency = (amount) => `Rp. ${amount.toLocaleString("id-ID")},-`;

  const isDateRangeValid = () => {
    if (startDate && endDate) {
      return startDate.isBefore(endDate) || startDate.isSame(endDate);
    }
    return true;
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      setTransactions(response.data.data.orders || []);
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

  // Update logic for filtering by month
  const handleUpdateReport = () => {
    let filteredTransactions = transactions;

    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const start = startDate.toDate();
        const end = endDate.toDate();
        return transactionDate >= start && transactionDate <= end;
      });
    }

    if (selectedMonth) {
      const selectedMonthValue = selectedMonth.month();
      const selectedYearValue = selectedMonth.year();

      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        return (
          transactionMonth === selectedMonthValue &&
          transactionYear === selectedYearValue
        );
      });
    }

    setTransactions(filteredTransactions);
    groupTransactionsByUser();
  };

  const handleReset = async () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedMonth(null);
    setSearchTerm("");
    await fetchTransactions();
    groupTransactionsByUser();
  };

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGroupedData = Object.entries(groupedData).filter(
    ([userName, userTransactions]) =>
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userTransactions.some((transaction) =>
        transaction._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          <Box sx={{ bgcolor: "#b08968", p: 2, borderRadius: "4px 4px 0 0", textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "white" }}>
              Laporan Penjualan
            </Typography>
          </Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <DatePicker
                label="Tanggal Awal"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} error={!isDateRangeValid()} />}
              />
              <DatePicker
                label="Tanggal Akhir"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} error={!isDateRangeValid()} />}
              />
              <DatePicker
                views={["year", "month"]}
                label="Filter Bulan"
                value={selectedMonth}
                onChange={(newValue) => setSelectedMonth(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                label="Cari User/Transaksi"
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#b08968", color: "white" }}
                onClick={handleUpdateReport}
                disabled={!isDateRangeValid()}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#C50102", color: "white" }}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#1976D2", color: "white" }}
                onClick={() => setOpenPreview(true)}
              >
                Preview & Download PDF
              </Button>
            </Box>
            {!isDateRangeValid() && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Tanggal Awal tidak boleh lebih besar dari Tanggal Akhir.
              </Typography>
            )}
          </Paper>
          <Paper sx={{ p: 3 }}>
            {filteredGroupedData.map(([userName, userTransactions]) => {
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
          </Paper>
        </Container>
        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
          <DialogTitle>Preview Laporan Penjualan</DialogTitle>
          <DialogContent>
            <div ref={previewRef} style={{ padding: "20px" }}>
              {filteredGroupedData.map(([userName, userTransactions]) => {
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)} color="error">
              Close
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

export default SalesPage;
