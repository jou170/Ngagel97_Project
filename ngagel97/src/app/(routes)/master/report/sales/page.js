"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const formatCurrency = (amount) => `Rp. ${amount.toLocaleString("id-ID")},-`;

  // Fetch data from the API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      console.log("API response:", response.data);

      // Extract the transactions array from the nested structure
      const transactionsArray = response.data.data.orders || [];

      // Format the transactions to extract only the required fields
      const formattedTransactions = transactionsArray.map((transaction) => ({
        idTransaksi: transaction._id.slice(-5), // Ambil 5 digit terakhir dari _id
        date: transaction.createdAt,
        ongkir: transaction.ongkir || 0,
        subtotal: transaction.subtotal || 0,
        total: transaction.total || 0,
      }));

      setTransactions(formattedTransactions);
      setFilteredData(formattedTransactions); // Initialize filtered data
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          minHeight: "100vh",
          padding: "20px",
        }}
      >
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
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                      }}
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
      </div>
    </LocalizationProvider>
  );
};

export default SalesPage;
