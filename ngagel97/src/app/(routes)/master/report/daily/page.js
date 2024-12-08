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
  Typography,
  Container,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Generate dummy data
const generateDummyData = () => {
  return Array.from({ length: 20 }, (_, index) => {
    const date = new Date(2024, 10, index + 1); // Generate dates in November 2024
    const total = Math.floor(Math.random() * 800000) + 200000; // Random price
    return {
      id: index + 1,
      date: dayjs(date).format("YYYY-MM-DD"), // Format date as string
      rawDate: date, // Keep raw date for filtering
      product: `Product ${index + 1}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      price: total,
    };
  });
};

const DailySalesPage = () => {
  const [data] = useState(generateDummyData()); // Original data
  const [filteredData, setFilteredData] = useState(data); // Filtered data for display
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering

  const formatCurrency = (amount) => {
    return `Rp. ${amount.toLocaleString("id-ID")},-`;
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredData(data); // Reset if no dates are selected
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.rawDate); // Raw date for comparison
      return itemDate >= startDate.toDate() && itemDate <= endDate.toDate();
    });

    setFilteredData(filtered);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          backgroundColor: "#F5E6D3",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              bgcolor: "#AB886D",
              p: 2,
              borderRadius: "4px 4px 0 0",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Laporan Transaksi Harian
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
                sx={{ bgcolor: "#493628", color: "white" }}
                onClick={handleFilter}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#C50102", color: "white" }}
                onClick={() => setFilteredData(data)}
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

export default DailySalesPage;
