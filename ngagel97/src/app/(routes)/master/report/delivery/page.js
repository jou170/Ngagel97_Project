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

// Mock transactions data
const transactions = [
  { date: "01/11/2024", product: "Laptop", quantity: 2, price: "$1200" },
  { date: "02/11/2024", product: "Phone", quantity: 5, price: "$500" },
  { date: "03/11/2024", product: "Tablet", quantity: 3, price: "$300" },
  { date: "04/11/2024", product: "Monitor", quantity: 4, price: "$200" },
  { date: "05/11/2024", product: "Keyboard", quantity: 10, price: "$50" },
];

const DeliveryPage = () => {
  return (
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
            Laporan Pengiriman
          </Typography>
        </Box>

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
                {transactions.map((transaction, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                    }}
                  >
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default DeliveryPage;
