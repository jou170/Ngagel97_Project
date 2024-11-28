import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";

const ProductList = () => {
  const dummyProducts = [
    {
      product_id: "P001",
      category: {
        category_id: "C001",
        category_name: "Electronics",
      },
      product_name: "Wireless Headphones",
      product_price: 99.99,
      product_description: "High-quality wireless headphones with noise cancellation.",
    },
    {
      product_id: "P002",
      category: {
        category_id: "C002",
        category_name: "Appliances",
      },
      product_name: "Smart Vacuum Cleaner",
      product_price: 199.99,
      product_description: "Automatic vacuum cleaner with smart home integration.",
    },
    {
      product_id: "P003",
      category: {
        category_id: "C003",
        category_name: "Fitness",
      },
      product_name: "Fitness Tracker",
      product_price: 49.99,
      product_description: "Wearable fitness tracker with heart rate monitor.",
    },
  ];

  const handleDetailClick = (productId) => {
    // Placeholder for button action, e.g., navigate or show modal
    alert(`Viewing details for Product ID: ${productId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product ID</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Price ($)</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>{product.category.category_name}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.product_price.toFixed(2)}</TableCell>
                <TableCell>{product.product_description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={() => handleDetailClick(product.product_id)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
