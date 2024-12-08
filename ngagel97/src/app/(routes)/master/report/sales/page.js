"use client";
import React, { useState } from "react";
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
  TextField, // Import TextField
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers"; // Import DatePicker

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([
    { date: "04/05/2024", product: "Print A4", quantity: 24, price: 440000 },
    { date: "05/05/2024", product: "Print A3", quantity: 12, price: 320000 },
    // Add more rows...
  ]);
  const [filteredData, setFilteredData] = useState(transactions); // Added filteredData state

  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString("id-ID")},-`;
  };

  const handleUpdateReport = () => {
    if (startDate && endDate) {
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(
          transaction.date.split("/").reverse().join("-")
        );
        const start = startDate.toDate();
        const end = endDate.toDate();
        return transactionDate >= start && transactionDate <= end;
      });
      setFilteredData(filteredTransactions); // Update filteredData
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          // backgroundColor: "#F5E6D3",
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
                onClick={handleUpdateReport} // Updated to use handleUpdateReport
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#b08968" }}
                onClick={() => setFilteredData(transactions)} // Reset the filtered data
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
                      <TableCell>{transaction.date}</TableCell>
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
