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

  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString("id-ID")},-`;
  };

  // Fetch data from API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      // Log the response to check the structure
      console.log("API response:", response.data);
  
      // Ensure the data exists and is an array before calling .map
      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((transaction) => ({
          date: transaction.createdAt,
          product: transaction.barang.map((item) => item.name).join(", "),
          quantity: transaction.barang.reduce((sum, item) => sum + item.quantity, 0),
          price: transaction.total,
        }));
        setTransactions(formattedData);
        setFilteredData(formattedData);
      } else {
        console.error("Data is not in the expected format or is missing.");
      }
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
                      <strong>Tanggal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Produk</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Jumlah</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Harga</strong>
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
                      <TableCell>{new Date(transaction.date).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{formatCurrency(transaction.price)}</TableCell>
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
