"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DailySalesReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction/online/master");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        // Filter transactions for today
        const today = new Date().toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
        });
        const filteredTransactions = data.data.orders.filter((transaction) => {
          // Konversi waktu UTC ke waktu lokal Indonesia (WIB)
          const localDate = new Date(transaction.createdAt).toLocaleDateString(
            "id-ID",
            {
              timeZone: "Asia/Jakarta",
            }
          );
          return localDate === today;
        });

        // Calculate total revenue
        const total = filteredTransactions.reduce(
          (sum, transaction) => sum + transaction.total,
          0
        );

        setTransactions(filteredTransactions);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penjualan Harian", 14, 20);
    doc.text("Per tanggal " + new Date().toLocaleDateString(), 14, 30);

    const tableColumn = [
      "Tanggal",
      "Produk",
      "Jumlah",
      "Jenis Pembayaran",
      "Total Pendapatan",
    ];
    const tableRows = [];

    transactions.forEach((transaction) => {
      transaction.jasa.forEach((jasa) => {
        // Add row for jasa
        tableRows.push([
          new Date(transaction.createdAt).toLocaleDateString(),
          `Jasa: ${jasa.nama}`,
          `${jasa.lembar || 0} lembar`,
          transaction.paymentMethod || "Offline",
          `Rp. ${transaction.total.toLocaleString()}`,
        ]);

        // Add rows for add-ons within jasa
        jasa.addOns.forEach((addon) => {
          tableRows.push([
            "",
            `Add-on: ${addon.nama}`,
            `${addon.qty || 0} qty`,
            "",
            "",
          ]);
        });
      });
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.text(
      `Total Penjualan Harian: Rp. ${totalRevenue.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.save("Daily_Sales_Report.pdf");
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h4" mb={3} color="black">
        Laporan Penjualan Harian
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Waktu</TableCell>
              <TableCell>Produk</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Harga Satuan</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Jenis Pembayaran</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) =>
              transaction.jasa.map((jasa, jasaIndex) => (
                <React.Fragment key={`${transaction._id}-${jasaIndex}`}>
                  <TableRow>
                    {jasaIndex === 0 && (
                      <TableCell
                        rowSpan={transaction.jasa.length + jasa.addOns.length}
                      >
                        {new Intl.DateTimeFormat("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false, // Format 24 jam
                          timeZone: "Asia/Jakarta", // Zona waktu WIB
                        }).format(new Date(transaction.createdAt))}
                      </TableCell>
                    )}

                    <TableCell>Jasa: {jasa.nama}</TableCell>
                    <TableCell>{jasa.lembar * jasa.qty || 0} lembar</TableCell>
                    <TableCell>
                      {"Rp "}
                      {jasa.harga.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {"Rp "}
                      {(jasa.harga * jasa.lembar * jasa.qty).toLocaleString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell
                      rowSpan={transaction.jasa.length + jasa.addOns.length}
                    >
                      {jasaIndex === 0 && transaction.isOnline
                        ? "Online"
                        : "Offline"}
                    </TableCell>
                    {jasaIndex === 0 && (
                      <TableCell
                        rowSpan={transaction.jasa.length + jasa.addOns.length}
                      >
                        Rp {transaction.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                    )}
                  </TableRow>
                  {jasa.addOns.map((addon, addonIndex) => (
                    <TableRow
                      key={`${transaction._id}-${jasaIndex}-${addonIndex}`}
                    >
                      <TableCell>Add-on: {addon.nama}</TableCell>
                      <TableCell>
                        {addon.qty || 0} {addon.tipeHarga}
                      </TableCell>
                      <TableCell>
                        Rp {addon.harga.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {"Rp "}
                        {(addon.harga * addon.qty).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} textAlign="right">
        <Typography variant="h6" mb={2}>
          Total Penjualan Harian: Rp. {totalRevenue.toLocaleString()}
        </Typography>
        <Button variant="contained" color="primary" onClick={generatePDF}>
          Unduh PDF
        </Button>
      </Box>
    </Box>
  );
};

export default DailySalesReport;
