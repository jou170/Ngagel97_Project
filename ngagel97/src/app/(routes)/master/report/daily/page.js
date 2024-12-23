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
import { jsPDF } from "jspdf";  // Import jsPDF
import "jspdf-autotable";  // Import autoTable plugin


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

  const today = dayjs().startOf("day");

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = dayjs(transaction.createdAt);
    return transactionDate.isSame(today, "day");
  });

  const calculateTotal = (items, field) => {
    return items.reduce((acc, item) => acc + (item[field] || 0), 0);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Laporan Penjualan Harian", 14, 20);

    // Table headers
    const headers = [
      ["Waktu", "Barang", "Jumlah", "Harga Jual", "Pembayaran", "Untung"]
    ];
    const rows = filteredTransactions.map((transaction) => {
      // Format Jasa and AddOns details
      const jasaDetails = transaction.jasa.map((jasa) => `${jasa.nama} - ${jasa.qty} lembar`).join(", ");
      const addOnsDetails = transaction.addOns.map((addOn) => `${addOn.nama} - ${addOn.qty} ${addOn.tipeHarga}`).join(", ");
      const totalJasaHarga = calculateTotal(transaction.jasa, "harga");
      const totalAddOnsHarga = calculateTotal(transaction.addOns, "subtotal");
      const totalHarga = transaction.total;
      const profit = totalHarga - totalJasaHarga - totalAddOnsHarga;

      return [
        dayjs(transaction.createdAt).format("DD/MM/YYYY"),
        `${jasaDetails}${addOnsDetails ? `, Addons: ${addOnsDetails}` : ""}`,
        `${transaction.jasa.length} items, ${transaction.addOns.reduce((acc, addOn) => acc + addOn.qty, 0)} items`,
        formatCurrency(totalHarga),
        transaction.isOnline ? "Online" : "Offline",
        formatCurrency(profit),
      ];
    });

    // Add table to PDF using autoTable
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      margin: { top: 30 },
    });

    // Total sales
    const totalSales = calculateTotal(filteredTransactions, "total");
    doc.setFontSize(12);
    doc.text(`Total Penjualan Harian: ${formatCurrency(totalSales)}`, 14, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save("laporan_penjualan_harian.pdf");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#b08968",
            p: 2,
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
          }}
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
                {filteredTransactions.map((transaction) => {
                  // Format Jasa details
                  const jasaDetails = transaction.jasa.map((jasa) => ({
                    description: `${jasa.nama} - ${jasa.qty} lembar`,
                    totalHarga: jasa.qty * jasa.harga,
                  }));

                  // Format AddOns details
                  const addOnsDetails = transaction.addOns.map((addOn) => ({
                    description: `${addOn.nama} - ${addOn.qty} ${addOn.tipeHarga}`,
                    totalHarga: addOn.subtotal,
                  }));

                  const totalJasaHarga = calculateTotal(transaction.jasa, "harga");
                  const totalAddOnsHarga = calculateTotal(transaction.addOns, "subtotal");

                  const totalHarga = transaction.total;
                  const profit = totalHarga - totalJasaHarga - totalAddOnsHarga;

                  return (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {dayjs(transaction.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <strong>Jasa:</strong> {jasaDetails.map((jasa, index) => (
                            <span key={`${transaction._id}-jasa-${index}`}>
                              {jasa.description}: {formatCurrency(jasa.totalHarga)}<br />
                            </span>
                          ))}
                          {addOnsDetails.length > 0 && (
                            <>
                              <strong>Addons:</strong><br />
                              {addOnsDetails.map((addOn, index) => (
                                <span key={`${transaction._id}-addon-${index}`}>
                                  {addOn.description}: {formatCurrency(addOn.totalHarga)}<br />
                                </span>
                              ))}
                            </>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <strong>Jasa:</strong> {transaction.jasa.length * 1} items<br />
                          <strong>Addons:</strong> {transaction.addOns.reduce((acc, addOn) => acc + addOn.qty, 0)} items
                        </Typography>
                      </TableCell>
                      <TableCell>{formatCurrency(totalHarga)}</TableCell>
                      <TableCell>{transaction.isOnline ? "Online" : "Offline"}</TableCell>
                      <TableCell>{formatCurrency(profit)}</TableCell>
                    </TableRow>
                  );
                })}
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
            <Button onClick={handleDownloadPDF} variant="contained" color="primary">
              Unduh PDF
            </Button>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default DailySalesReport;
