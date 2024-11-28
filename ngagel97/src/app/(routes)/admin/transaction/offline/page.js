"use client";

import React, { useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const OfflineTransactionPage = () => {
  const [rows, setRows] = useState([
    { tanggal: "04/05/2024", product: "Print A4", jumlah: 24, harga: "Rp. 440.000,-" },
    { tanggal: "05/05/2024", product: "Print A3", jumlah: 12, harga: "Rp. 320.000,-" },
    { tanggal: "07/05/2024", product: "Print A4", jumlah: 34, harga: "Rp. 540.000,-" },
    { tanggal: "12/05/2024", product: "Laminating", jumlah: 52, harga: "Rp. 840.000,-" },
    { tanggal: "23/05/2024", product: "Print A4", jumlah: 14, harga: "Rp. 240.000,-" },
  ]);

  const [newData, setNewData] = useState({
    product: "",
    jumlah: "",
    harga: "",
  });

  // Fungsi untuk mendapatkan tanggal hari ini
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fungsi untuk meng-handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  // Fungsi untuk menambahkan data baru ke tabel
  const handleAdd = () => {
    if (newData.product && newData.jumlah && newData.harga) {
      const todayDate = getCurrentDate(); // Ambil tanggal hari ini
      setRows((prevRows) => [
        ...prevRows,
        { tanggal: todayDate, product: newData.product, jumlah: parseInt(newData.jumlah), harga: newData.harga },
      ]);
      setNewData({ product: "", jumlah: "", harga: "" }); // Reset input setelah data ditambahkan
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4}}>
      <Typography variant="h5" align="center" gutterBottom color="black">
        Pencatatan Transaksi Offline
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>Tanggal</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Product</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Jumlah</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Harga</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.tanggal}</TableCell>
                <TableCell align="center">{row.product}</TableCell>
                <TableCell align="center">{row.jumlah}</TableCell>
                <TableCell align="center">{row.harga}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Input Product"
          name="product"
          variant="outlined"
          size="small"
          value={newData.product}
          onChange={handleInputChange}
        />
        <TextField
          label="Input Jumlah"
          name="jumlah"
          type="number"
          variant="outlined"
          size="small"
          value={newData.jumlah}
          onChange={handleInputChange}
        />
        <TextField
          label="Input Harga"
          name="harga"
          type="number"
          variant="outlined"
          size="small"
          value={newData.harga}
          onChange={handleInputChange}
        />
      </Box>
      <Button variant="contained" color="success" onClick={handleAdd}>
        Add
      </Button>
    </Container>
  );
};

export default OfflineTransactionPage;
