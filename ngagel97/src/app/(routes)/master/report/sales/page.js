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
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const groupTransactionsByUser = (filteredTransactions = transactions) => {
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const user = users.find((u) => u._id === transaction.userId);
      const userName = user ? user.name : "Transaksi Offline";

      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(transaction);
      return acc;
    }, {});

    setGroupedData(grouped);
  };

  const calculateGrandTotal = () => {
    return Object.entries(groupedData).reduce((grandTotal, [userName, userTransactions]) => {
      const totalTransaction = userTransactions.reduce(
        (acc, transaction) => acc + transaction.total,
        0
      );
      return grandTotal + totalTransaction;
    }, 0);
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

  const handleUpdateReport = () => {
    if (!startDate || !endDate) {
      groupTransactionsByUser();
      return;
    }

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = dayjs(transaction.createdAt);
      const start = startDate.startOf("day");
      const end = endDate.endOf("day");
      return transactionDate.isBetween(start, end, null, "[]");
    });

    groupTransactionsByUser(filteredTransactions);
  };

  const handleReset = async () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    await fetchTransactions();
    groupTransactionsByUser();
  };

  const handleDownloadPDF = () => {
    const input = previewRef.current;
  
    const startDateText = startDate ? dayjs(startDate).format("DD/MM/YYYY") : "Semua Data";
    const endDateText = endDate ? dayjs(endDate).format("DD/MM/YYYY") : "Semua Data";
    const periodText =
      startDate || endDate
        ? `Periode: ${startDateText} - ${endDateText}`
        : "Periode: Semua Data";
  
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 50;
  
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Toko Print Ngagel97", 105, 10, { align: "center" });
  
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text(
          "Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng, Surabaya, Jawa Timur 60284",
          105,
          17,
          { align: "center" }
        );
        pdf.text("Contact Number: (031) 5027852", 105, 23, { align: "center" });
  
        pdf.setFontSize(14);
        pdf.text("Laporan Penjualan", 105, 33, { align: "center" });
  
        pdf.setFontSize(12);
        pdf.text(periodText, 105, 40, { align: "center" });
  
        // Tambahkan gambar (canvas hasil render tabel)
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  
        // Jika konten melebihi satu halaman, tambahkan halaman berikutnya
        let heightLeft = imgHeight - pageHeight + position;
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
        transaction.idTransaksi.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <TableCell>{transaction.idTransaksi}</TableCell>
                            <TableCell>
                              {dayjs(transaction.createdAt).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                            <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                            <TableCell>{formatCurrency(transaction.total)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: "#f1f1f1" }}>
                          <TableCell colSpan={4} align="right">
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell>
                            <strong>{formatCurrency(totalTransaction)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography variant="h6">
                <strong>Grand Total: {formatCurrency(calculateGrandTotal())}</strong>
              </Typography>
            </Box>
          </Paper>
        </Container>

        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="lg">
          <DialogTitle>Preview PDF</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "100%", bgcolor: "white", p: 2 }} ref={previewRef}>
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
                              <TableCell>{transaction.idTransaksi}</TableCell>
                              <TableCell>
                                {dayjs(transaction.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                              <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                              <TableCell>{formatCurrency(transaction.total)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: "#f1f1f1" }}>
                            <TableCell colSpan={4} align="right">
                              <strong>Total</strong>
                            </TableCell>
                            <TableCell>
                              <strong>{formatCurrency(totalTransaction)}</strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                );
              })}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Typography variant="h6">
                  <strong>Grand Total: {formatCurrency(calculateGrandTotal())}</strong>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)}>Close</Button>
            <Button variant="contained" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default SalesPage;
