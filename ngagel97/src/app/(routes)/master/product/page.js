"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";

const PageLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#F5E6D3",
});

const HeaderContainer = styled(Box)({
  padding: "20px",
  borderRadius: "4px 4px 0 0",
  textAlign: "center",
  marginTop: "20px",
});

const ContentContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  padding: "20px",
  flexGrow: 1,
});

const FormContainer = styled(Box)({
  flex: "1",
  maxWidth: "30%",
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

const TableContainerStyled = styled(Box)({
  flex: "2",
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

const ProductPage = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Print A4", price: 5000, category: "Print" },
    { id: 2, name: "Print A3", price: 10000, category: "Print" },
    { id: 3, name: "Laminating", price: 5000, category: "Laminating" },
    { id: 0, name: "Laminating", price: 5000, category: "Laminating" },
  ]);
  
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    category: "",
  });

  const router = useRouter(); // Initialize useRouter from next/navigation

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    if (formValues.name && formValues.price && formValues.category) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          ...formValues,
          price: parseInt(formValues.price),
        },
      ]);
      setFormValues({ name: "", price: "", category: "" });
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEditProduct = (id) => {
    // Programmatically navigate to the product edit page
    router.push(`/master/list/product/edit/${id}`);
  };

  return (
    <PageLayout>
      {/* Header */}
      <HeaderContainer>
        <Box
          sx={{
            bgcolor: "#b08968",
            p: 2,
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Add product
          </Typography>
        </Box>
      </HeaderContainer>

      {/* Main Content */}
      <Container maxWidth="lg">
        <ContentContainer>
          {/* Form Section */}
          <FormContainer>
            <Typography variant="h5" mb={2} color="black">
              Tambah Produk
            </Typography>
            <TextField
              label="Nama Produk"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Harga Produk"
              name="price"
              type="number"
              value={formValues.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Kategori Produk"
              name="category"
              value={formValues.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddProduct}
            >
              Tambah
            </Button>
          </FormContainer>

          {/* Table Section */}
          <TableContainerStyled>
            <Typography variant="h5" mb={2} color="black">
              Daftar Produk
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Nama</strong></TableCell>
                    <TableCell><strong>Harga</strong></TableCell>
                    <TableCell><strong>Kategori</strong></TableCell>
                    <TableCell><strong>Aksi</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                      }}
                    >
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>Rp. {product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{ marginRight: "10px" }}
                          onClick={() => handleEditProduct(product.id)} // Navigate on click
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableContainerStyled>
        </ContentContainer>
      </Container>
    </PageLayout>
  );
};

export default ProductPage;
