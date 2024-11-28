"use client";

import React, { useState } from "react";
import Joi from "joi";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const SalesReport = () => {
  const [error, setError] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  // Data dummy
  const salesData = [
    {
      date: "04/05/2024",
      product: "Print A4",
      quantity: 24,
      price: "Rp. 440.000,-",
    },
    {
      date: "05/05/2024",
      product: "Print A3",
      quantity: 12,
      price: "Rp. 320.000,-",
    },
    {
      date: "07/05/2024",
      product: "Print A4",
      quantity: 34,
      price: "Rp. 540.000,-",
    },
    {
      date: "12/05/2024",
      product: "Laminating",
      quantity: 52,
      price: "Rp. 840.000,-",
    },
    {
      date: "23/05/2024",
      product: "Print A4",
      quantity: 14,
      price: "Rp. 240.000,-",
    },
  ];

  // Joi schema for validation
  const schema = Joi.object({
    startDate: Joi.date().allow("").required().messages({
      "date.base": "Tanggal mulai harus berupa tanggal yang valid",
      "any.required": "Tanggal mulai harus diisi",
    }),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .allow("")
      .required()
      .messages({
        "date.base": "Tanggal selesai harus berupa tanggal yang valid",
        "date.greater": "Tanggal selesai harus lebih besar dari tanggal mulai",
        "any.required": "Tanggal selesai harus diisi",
      }),
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDates = { ...dates, [name]: value };
    setDates(newDates);

    // Validate only when the date fields are updated
    const { error } = schema.validate(newDates);
    if (error) {
      setError(error.details[0].message);
    } else {
      setError("");
    }
  };

  return (
    <div style={{ backgroundColor: "#F4E1D2", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box sx={{ padding: "80px 20px" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "#6d4c41" }}
        >
          Laporan Penjualan
        </Typography>

        {/* Input Tanggal */}
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <TextField
            name="startDate"
            type="date"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#fff" }}
            value={dates.startDate}
            onChange={handleDateChange}
            error={!!error}
          />
          <TextField
            name="endDate"
            type="date"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#fff" }}
            value={dates.endDate}
            onChange={handleDateChange}
            error={!!error}
          />
          <Button variant="contained" sx={{ backgroundColor: "#493628" }}>
            Update Laporan
          </Button>
        </Box>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ marginBottom: "10px" }}
          >
            {error}
          </Typography>
        )}

        {/* Tabel Laporan */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Tanggal</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Jumlah</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Harga</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default SalesReport;
