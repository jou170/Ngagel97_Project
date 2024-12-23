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
    doc.text(
      "Per tanggal " +
        new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Format 24 jam
          timeZone: "Asia/Jakarta", // Zona waktu WIB
        }),
      14,
      30
    );

    // Kolom tabel sesuai dengan tabel di antarmuka
    const tableColumn = [
      "Waktu",
      "Produk",
      "Jumlah",
      "Harga Satuan",
      "Subtotal",
      "Jenis Pembayaran",
      "Total",
    ];
    const tableRows = [];

    // Mengisi baris tabel
    transactions.forEach((transaction) => {
      transaction.jasa.forEach((jasa, jasaIndex) => {
        // Baris utama untuk jasa
        const waktu =
          jasaIndex === 0
            ? new Intl.DateTimeFormat("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Jakarta",
              }).format(new Date(transaction.createdAt))
            : "";
        const jenisPembayaran =
          jasaIndex === 0 ? (transaction.isOnline ? "Online" : "Offline") : "";
        const total =
          jasaIndex === 0
            ? `Rp ${transaction.subtotal.toLocaleString("id-ID")}`
            : "";

        tableRows.push([
          waktu,
          `Jasa: ${jasa.nama}`,
          `${jasa.lembar * jasa.qty || 0} lembar`,
          `Rp ${jasa.harga.toLocaleString("id-ID")}`,
          `Rp ${(jasa.harga * jasa.lembar * jasa.qty).toLocaleString("id-ID")}`,
          jenisPembayaran,
          total,
        ]);

        // Baris tambahan untuk add-on
        jasa.addOns.forEach((addon) => {
          tableRows.push([
            "",
            `Add-on: ${addon.nama}`,
            `${addon.qty || 0} ${addon.tipeHarga}`,
            `Rp ${addon.harga.toLocaleString("id-ID")}`,
            `Rp ${(addon.harga * addon.qty).toLocaleString("id-ID")}`,
            "",
            "",
          ]);
        });
      });
    });

    // Menambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    // Menambahkan total penjualan
    doc.text(
      `Total Penjualan Harian: Rp. ${totalRevenue.toLocaleString("id-ID")}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Mengunduh PDF
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
            {transactions.map((transaction) => {
              const totalAddOns = transaction.jasa.reduce(
                (acc, jasa) => acc + jasa.addOns.length,
                0
              ); // Total add-ons dari semua jasa
              const totalRows =
                transaction.jasa.length +
                totalAddOns +
                transaction.barang.length +
                transaction.addOns.length; // Total baris untuk rowSpan

              return (
                <>
                  {/* Render for jasa */}
                  {transaction.jasa.map((jasa, jasaIndex) => (
                    <React.Fragment key={`${transaction._id}-${jasaIndex}`}>
                      <TableRow>
                        {jasaIndex === 0 && (
                          <TableCell rowSpan={totalRows}>
                            {new Intl.DateTimeFormat("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "Asia/Jakarta",
                            }).format(new Date(transaction.createdAt))}
                          </TableCell>
                        )}
                        <TableCell>Jasa: {jasa.nama}</TableCell>
                        <TableCell>
                          {jasa.lembar * jasa.qty || 0} lembar
                        </TableCell>
                        <TableCell>
                          Rp {jasa.harga.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          Rp{" "}
                          {(jasa.harga * jasa.lembar * jasa.qty).toLocaleString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell rowSpan={totalRows}>
                          {transaction.isOnline ? "Online" : "Offline"}
                        </TableCell>
                        {jasaIndex === 0 && (
                          <TableCell rowSpan={totalRows}>
                            Rp {transaction.subtotal.toLocaleString("id-ID")}
                          </TableCell>
                        )}
                      </TableRow>

                      {/* Render AddOns untuk jasa */}
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
                            Rp{" "}
                            {(addon.harga * addon.qty).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Render for add-ons diluar jasa */}
                  {transaction.addOns.map((addon, addonIndex) => (
                    <TableRow key={`${transaction._id}-addon-${addonIndex}`}>
                      <TableCell>Add-on: {addon.nama}</TableCell>
                      <TableCell>{addon.qty} pcs</TableCell>
                      <TableCell>
                        Rp {addon.harga.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        Rp {addon.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Render for barang */}
                  {transaction.barang.map((barang, barangIndex) => (
                    <TableRow key={`${transaction._id}-barang-${barangIndex}`}>
                      <TableCell>Barang: {barang.nama}</TableCell>
                      <TableCell>{barang.qty} pcs</TableCell>
                      <TableCell>
                        Rp {barang.harga.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        Rp {barang.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
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
