"use client";

import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

const AddProductPage = () => {
  const [error, setError] = useState("");

  const products = [
    { id: 1, name: "Print A4", price: "Rp. 5.000,-", category: "Print" },
    { id: 2, name: "Print A3", price: "Rp. 10.000,-", category: "Print" },
    { id: 3, name: "Laminating", price: "Rp. 5.000,-", category: "Laminating" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm();

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Nama produk harus diisi",
      "string.min": "Nama produk harus memiliki minimal 3 karakter",
      "string.max": "Nama produk tidak boleh lebih dari 30 karakter",
    }),
    price: Joi.number().positive().required().messages({
      "number.base": "Harga produk harus berupa angka",
      "number.positive": "Harga produk harus bernilai positif",
      "any.required": "Harga produk harus diisi",
    }),
    description: Joi.string().allow("").max(500).messages({
      "string.max": "Deskripsi tidak boleh lebih dari 500 karakter",
    }),
    category: Joi.string().min(3).required().messages({
      "string.empty": "Kategori produk harus diisi",
      "string.min": "Kategori produk harus memiliki minimal 3 karakter",
    }),
  });

  const onSubmit = async (data) => {
    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      validation.error.details.forEach((err) => {
        setFormError(err.context.key, { message: err.message });
      });
      return;
    }

    clearErrors();
    alert("Produk berhasil ditambahkan!");
  };

  return (
    <div
      style={{
        backgroundColor: "#F4E1D2",
        minHeight: "100vh",
        paddingTop: "10px",
      }}
    >
      {/* Main Content */}
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          marginTop: "80px",
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: "20px" }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ marginBottom: "20px" }}
              >
                Tambah Produk
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                {[
                  "Nama Produk",
                  "Harga Produk",
                  "Deskripsi Produk",
                  "Kategori Produk",
                ].map((field, idx) => (
                  <Box key={idx} sx={{ marginBottom: "10px" }}>
                    <label style={labelStyle}>{field}</label>
                    <TextField
                      fullWidth
                      multiline={field === "Deskripsi Produk"}
                      rows={field === "Deskripsi Produk" ? 4 : undefined}
                      {...register(field.toLowerCase().replace(" ", ""))}
                      error={!!errors[field.toLowerCase().replace(" ", "")]}
                      helperText={
                        errors[field.toLowerCase().replace(" ", "")]?.message
                      }
                    />
                  </Box>
                ))}

                <Box mt={2}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Upload File
                  </Button>
                </Box>

                <Box mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#493628" }}
                  >
                    Tambah
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* Product List Section */}
          <Grid item xs={12} md={8}>
            <Paper style={{ padding: "20px" }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ marginBottom: "20px" }}
              >
                Produk List
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["ID", "Nama", "Harga", "Kategori", "Aksi"].map(
                        (col) => (
                          <TableCell key={col} sx={{ fontWeight: "bold" }}>
                            {col}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        {Object.values(product).map((value, idx) => (
                          <TableCell key={idx}>{value}</TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ marginRight: "10px" }}
                          >
                            Edit
                          </Button>
                          <Button variant="contained" color="error">
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

// Label Style
const labelStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#493628",
  marginBottom: "5px",
  display: "block",
};

export default AddProductPage;
