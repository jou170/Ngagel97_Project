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
  Box,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";

const DailySalesPage = () => {
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
        date: transaction.createdAt,
        ongkir: transaction.ongkir || 0,
        subtotal: transaction.subtotal || 0,
        total: transaction.total || 0,
      }));

      // Filter transactions within the last 24 hours
      const now = new Date();
      const last24HoursTransactions = formattedTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const diffTime = now - transactionDate; // Difference in milliseconds
        return diffTime <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      });

      setTransactions(last24HoursTransactions);
      setFilteredData(last24HoursTransactions); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate total revenue
  const totalRevenue = filteredData.reduce((sum, transaction) => sum + transaction.total, 0);

  return (
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

        {/* Table */}
        <Paper sx={{ p: 3 }}>
          {filteredData.length === 0 ? (
            <Typography variant="h6" align="center" color="text.secondary">
              Tidak ada Transaksi Untuk Hari ini
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#d7ccc8" }}>
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

              {/* Total Revenue */}
              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Typography variant="h6">
                  Total Pendapatan: <strong>{formatCurrency(totalRevenue)}</strong>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default DailySalesPage;
