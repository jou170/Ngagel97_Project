"use client";

import React, { useState } from "react";
import Joi from "joi";
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
  TextField,
} from "@mui/material";
import Navbar from "../../components/navbar";

const DeliveryReport = () => {
  const [error, setError] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  // Data dummy
  const deliveryData = [
    { id: "OID0010", name: "Budi", status: "Selesai", date: "04/05/2024" },
    { id: "OID0011", name: "Welly", status: "Pending", date: "04/05/2024" },
    { id: "OID0024", name: "Agus", status: "Pending", date: "12/12/2023" },
    { id: "OID0045", name: "Wati", status: "Selesai", date: "12/12/2023" },
    { id: "OID0076", name: "Vely", status: "Selesai", date: "12/12/2023" },
  ];

  // Joi schema for validation
  const schema = Joi.object({
    startDate: Joi.date().required().messages({
      "date.base": "Tanggal mulai harus berupa tanggal yang valid",
      "any.required": "Tanggal mulai harus diisi",
    }),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
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

    // Validate both start and end date together
    const { error } = schema.validate(newDates);
    if (error) {
      setError(error.details[0].message);
    } else {
      setError("");
    }
  };

  return (
    <div style={{ backgroundColor: "#F4E1D2", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ padding: "80px 20px" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "#6d4c41" }}
        >
          Laporan Pengiriman
        </Typography>

        {/* Filter Section */}
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6d4c41",
              color: "#fff",
              "&:hover": { backgroundColor: "#5d4037" },
            }}
          >
            Update Laporan
          </Button>
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: "10px" }}>
            {error}
          </Typography>
        )}

        {/* Tabel Laporan */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ORDER ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nama Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tanggal Pengiriman</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        color: "#fff",
                        backgroundColor:
                          row.status === "Selesai" ? "#4caf50" : "#ff9800",
                      }}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default DeliveryReport;
