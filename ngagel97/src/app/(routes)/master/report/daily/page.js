'use client';

import React, { useState, useEffect } from "react";
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
  Button,
} from "@mui/material";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DailySalesReport = () => {
  const [transactions, setTransactions] = useState([]);

  const formatCurrency = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      setTransactions(response.data.data.orders);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Get today's date (ignoring time)
  const today = dayjs().startOf('day');

  // Filter transactions that happened today
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.createdAt);
    return transactionDate.isSame(today, 'day');
  });

  const calculateTotal = (items, field) => {
    return items.reduce((acc, item) => acc + (item[field] || 0), 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Box
          sx={{ bgcolor: "#b08968", p: 2, borderRadius: "4px 4px 0 0", textAlign: "center" }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Laporan Penjualan Harian
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                  <TableCell>Waktu</TableCell>
                  <TableCell>Barang</TableCell>
                  <TableCell>Jumlah</TableCell>
                  <TableCell>Harga Jual</TableCell>
                  <TableCell>Pembayaran</TableCell>
                  <TableCell>Untung</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleTimeString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {transaction.jasa.map((jasa, jasaIndex) => (
                        <Box key={`${transaction._id}-jasa-${jasa.jasaId}-${jasaIndex}`}>
                          <Typography>{jasa.nama}</Typography>
                          {jasa.addOns.map((addOn, addOnIndex) => (
                            <Typography
                              key={`${transaction._id}-jasa-${jasa.jasaId}-addOn-${addOn.addOnId}-${addOnIndex}`}
                              sx={{ ml: 2, fontStyle: "italic" }}
                            >
                              - {addOn.nama}
                            </Typography>
                          ))}
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>{transaction.jasa.length}</TableCell>
                    <TableCell>{formatCurrency(transaction.total)}</TableCell>
                    <TableCell>{transaction.isOnline ? "Online" : "Offline"}</TableCell>
                    <TableCell>
                      {formatCurrency(transaction.total - calculateTotal(transaction.jasa, "harga"))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
            Total Penjualan Harian: {formatCurrency(calculateTotal(filteredTransactions, "total"))}
          </Typography>

          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button variant="contained" color="primary">
              Unduh PDF
            </Button>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default DailySalesReport;
