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
    
    // Set font size and bold for the store name only
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Toko Print Ngagel97", 104, 20, null, null, 'center');
    
    // Set font size and regular for the rest of the text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Center the text horizontally by using the page width
    const pageWidth = doc.internal.pageSize.width;
    const textX = pageWidth / 2;
    
    // Add store details (centered)
    doc.text("Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng, Surabaya, Jawa Timur 60284", textX, 25, null, null, 'center');
    doc.text("Contact Number: (031) 5027852", textX, 30, null, null, 'center');
    
    // Add space between "Contact Number" and "Laporan Penjualan Harian"
    const spaceAfterContact = 10; // Adjust this value to increase/decrease the space
    doc.text("Laporan Penjualan Harian", textX, 35 + spaceAfterContact, null, null, 'center');
    
    doc.text(
      "Per tanggal " +
        new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }),
      textX,
      40 + spaceAfterContact, // Adjust this value to add space after "Per tanggal"
      null,
      null,
      'center'
    );
  
    // Add additional space before table
    const spaceAfterDate = 15; // Adjust this value to increase/decrease the space
    const startTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 45 + spaceAfterDate; // If lastAutoTable exists, start from the next Y

    // Column names for the table
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
    
    let totalRevenueFromTable = 0; // Track total revenue from the displayed data
    
    // Populate table rows
    transactions.forEach((transaction) => {
      transaction.jasa.forEach((jasa, jasaIndex) => {
        // Main row for jasa
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
  
        // Add the revenue from this service
        totalRevenueFromTable += jasa.harga * jasa.lembar * jasa.qty;
  
        // Add rows for add-ons
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
  
          // Add the revenue from the addon
          totalRevenueFromTable += addon.harga * addon.qty;
        });
      });
  
      // Render for barang
      transaction.barang.forEach((barang) => {
        tableRows.push([
          "",
          `Barang: ${barang.nama}`,
          `${barang.qty} pcs`,
          `Rp ${barang.harga.toLocaleString("id-ID")}`,
          `Rp ${barang.subtotal.toLocaleString("id-ID")}`,
          "",
          "",
        ]);
  
        // Add the revenue from this item
        totalRevenueFromTable += barang.subtotal;
      });
  
      // Render for add-ons outside jasa
      transaction.addOns.forEach((addon) => {
        tableRows.push([
          "",
          `Add-on: ${addon.nama}`,
          `${addon.qty} pcs`,
          `Rp ${addon.harga.toLocaleString("id-ID")}`,
          `Rp ${addon.subtotal.toLocaleString("id-ID")}`,
          "",
          "",
        ]);
  
        // Add the revenue from the addon
        totalRevenueFromTable += addon.subtotal;
      });
    });
  
    // Add table to PDF with column names and the table rows
    doc.autoTable({
      head: [tableColumn], // Add column headers here
      body: tableRows,
      startY: startTableY, // Ensure the table starts below previous text
    });
  
    // Add total sales
    doc.text(
      `Total Penjualan Harian: Rp. ${totalRevenueFromTable.toLocaleString("id-ID")}`,
      textX,
      doc.lastAutoTable.finalY + 10 // Adjusting space after table
    );
  
    // Download PDF
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
            {transactions.map((transaction, transactionIndex) => {
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
                <React.Fragment key={`transaction-${transaction._id}-${transactionIndex}`}>
                  {/* Render for jasa */}
                  {transaction.jasa.map((jasa, jasaIndex) => (
                    <React.Fragment key={`jasa-${transaction._id}-${jasaIndex}`}>
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
                        <TableCell>{jasa.lembar * jasa.qty || 0} lembar</TableCell>
                        <TableCell>Rp {jasa.harga.toLocaleString("id-ID")}</TableCell>
                        <TableCell>
                          Rp {(jasa.harga * jasa.lembar * jasa.qty).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>{transaction.isOnline ? "Online" : "Offline"}</TableCell>
                        {jasaIndex === 0 && (
                          <TableCell rowSpan={totalRows}>
                            Rp {transaction.subtotal.toLocaleString("id-ID")}
                          </TableCell>
                        )}
                      </TableRow>
  
                      {/* Render for add-ons */}
                      {jasa.addOns.map((addon, addonIndex) => (
                        <TableRow key={`addon-${addonIndex}`}>
                          <TableCell></TableCell>
                          <TableCell>Add-on: {addon.nama}</TableCell>
                          <TableCell>{addon.qty} pcs</TableCell>
                          <TableCell>Rp {addon.harga.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            Rp {(addon.harga * addon.qty).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
  
                  {/* Render for barang */}
                  {transaction.barang.map((barang, barangIndex) => (
                    <TableRow key={`barang-${barangIndex}`}>
                      <TableCell></TableCell>
                      <TableCell>Barang: {barang.nama}</TableCell>
                      <TableCell>{barang.qty} pcs</TableCell>
                      <TableCell>Rp {barang.harga.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        Rp {barang.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
  
                  {/* Render for add-ons outside jasa */}
                  {transaction.addOns.map((addon, addonIndex) => (
                    <TableRow key={`addon-outside-${addonIndex}`}>
                      <TableCell></TableCell>
                      <TableCell>Add-on: {addon.nama}</TableCell>
                      <TableCell>{addon.qty} pcs</TableCell>
                      <TableCell>Rp {addon.harga.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        Rp {addon.subtotal.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={generatePDF} sx={{ marginTop: 3 }}>
        Unduh Laporan PDF
      </Button>
    </Box>
  );
};

export default DailySalesReport;
