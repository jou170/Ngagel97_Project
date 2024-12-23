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
        const today = new Date().toISOString().split("T")[0];
        const filteredTransactions = data.data.orders.filter((transaction) =>
          transaction.createdAt.startsWith(today)
        );

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

    const tableColumn = [
      "Tanggal",
      "Barang",
      "Jumlah",
      "Jenis Pembayaran",
      "Total Pendapatan",
    ];
    const tableRows = transactions.map((transaction) => {
      const jasaDetails = transaction.jasa
        .map((jasa) => {
          const addonsDetails = jasa.addOns
            .map(
              (addon, addonIndex) =>
                `${addonIndex + 1}. ${addon.nama}: ${addon.qty || 0} ${
                  addon.tipeHarga || "qty"
                }`
            )
            .join("\n");

          return `Jasa: ${jasa.nama} - ${jasa.lembar || 0} lembar` + 
            (addonsDetails.length > 0 ? `\nAdd-ons:\n${addonsDetails}` : "");
        })
        .join("\n");

      const totalJasa = transaction.jasa.reduce(
        (sum, jasa) => sum + (jasa.lembar || 0),
        0
      );
      const totalAddons = transaction.jasa.reduce(
        (sum, jasa) =>
          sum +
          jasa.addOns.reduce(
            (addonSum, addon) => addonSum + (addon.qty || 0),
            0
          ),
        0
      );

      return [
        new Date(transaction.createdAt).toLocaleDateString(),
        jasaDetails,
        `Jasa: ${totalJasa} lembar\nAdd-ons: ${totalAddons} qty`,
        transaction.paymentMethod || "Offline",
        `Rp. ${transaction.total.toLocaleString()}`,
      ];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
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
              <TableCell>Tanggal</TableCell>
              <TableCell>Barang</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Jenis Pembayaran</TableCell>
              <TableCell>Total Pendapatan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const totalJasa = transaction.jasa.reduce(
                (sum, jasa) => sum + (jasa.lembar || 0),
                0
              );
              const totalAddons = transaction.jasa.reduce(
                (sum, jasa) =>
                  sum +
                  jasa.addOns.reduce(
                    (addonSum, addon) => addonSum + (addon.qty || 0),
                    0
                  ),
                0
              );

              return transaction.jasa.map((jasa, index) => (
                <TableRow key={`${transaction._id}-${index}`}>
                  {index === 0 && (
                    <TableCell rowSpan={transaction.jasa.length}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>
                    <div>
                      Jasa: {jasa.nama} : <strong>{jasa.lembar || 0} lembar</strong>
                      {jasa.addOns.length > 0 && (
                        <div>
                          <strong>Add-ons:</strong>
                          {jasa.addOns.map((addon, addonIndex) => (
                            <div key={addonIndex}>
                              {addonIndex + 1}. {addon.nama}: {addon.qty || 0}{" "}
                              {addon.tipeHarga || "qty"}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    Jasa: <strong>{jasa.lembar || 0}</strong> lembar <br />
                    Add-ons: <strong>{totalAddons}</strong> qty
                  </TableCell>
                  <TableCell>{transaction.paymentMethod || "Offline"}</TableCell>
                  {index === 0 && (
                    <TableCell rowSpan={transaction.jasa.length}>
                      Rp. {transaction.total.toLocaleString()}
                    </TableCell>
                  )}
                </TableRow>
              ));
            })}
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
