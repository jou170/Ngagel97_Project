"use client"; // Enable client-side rendering

import React, { use } from "react";
import { Box, Typography, Paper } from "@mui/material";

// Dummy data for demonstration
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

const ProductDetail = async ({ params }) => {
  // Await `params` as it's now a Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = dummyProducts.find((prod) => prod.product_id === id);

  if (!product) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" color="error">
          Product not found!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Detail
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">
          Product Name: {product.product_name}
        </Typography>
        <Typography variant="body1">
          Category: {product.category.category_name}
        </Typography>
        <Typography variant="body1">
          Price: ${product.product_price.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Description: {product.product_description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProductDetail;
