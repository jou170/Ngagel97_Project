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

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openPreview, setOpenPreview] = useState(false); // Preview dialog state
  const previewRef = useRef(null); // Reference for the preview content

  const formatCurrency = (amount) => `Rp. ${amount.toLocaleString("id-ID")},-`;

  // Fetch data from the API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      console.log("API response:", response.data);

      const transactionsArray = response.data.data.orders || [];
      const formattedTransactions = transactionsArray.map((transaction) => ({
        idTransaksi: transaction._id.slice(-5),
        date: transaction.createdAt,
        ongkir: transaction.ongkir || 0,
        subtotal: transaction.subtotal || 0,
        total: transaction.total || 0,
      }));

      setTransactions(formattedTransactions);
      setFilteredData(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateReport = () => {
    if (startDate && endDate) {
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const start = startDate.toDate();
        const end = endDate.toDate();
        return transactionDate >= start && transactionDate <= end;
      });
      setFilteredData(filteredTransactions);
    }
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              bgcolor: "#b08968",
              p: 2,
              borderRadius: "4px 4px 0 0",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Laporan Penjualan
            </Typography>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <DatePicker
                label="Tanggal Awal"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="Tanggal Akhir"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#b08968", color: "white" }}
                onClick={handleUpdateReport}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#C50102", color: "white" }}
                onClick={() => setFilteredData(transactions)}
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
          </Paper>

          {/* Table */}
          <Paper sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                    <TableCell>
                      <strong>ID Transaksi</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tanggal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ongkir</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Subtotal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((transaction, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}
                    >
                      <TableCell>{transaction.idTransaksi}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                      <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                      <TableCell>{formatCurrency(transaction.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

        {/* PDF Preview Dialog */}
        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
          <DialogTitle>Preview Laporan Penjualan</DialogTitle>
          <DialogContent>
            <div ref={previewRef} style={{ padding: "20px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Laporan Penjualan
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID Transaksi</strong></TableCell>
                      <TableCell><strong>Tanggal</strong></TableCell>
                      <TableCell><strong>Ongkir</strong></TableCell>
                      <TableCell><strong>Subtotal</strong></TableCell>
                      <TableCell><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.idTransaksi}</TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                        <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                        <TableCell>{formatCurrency(transaction.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
