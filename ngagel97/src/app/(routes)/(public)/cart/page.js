"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartPage = () => {
  // Dummy data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nama Barang",
      description: "Deskripsi Pesanan",
      price: "Harga Barang",
      quantity: 0,
      image: "https://via.placeholder.com/100", // Replace with actual image URL
    },
    {
      id: 2,
      name: "Nama Barang",
      description: "Deskripsi Pesanan",
      price: "Harga Barang",
      quantity: 0,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Nama Barang",
      description: "Deskripsi Pesanan",
      price: "Harga Barang",
      quantity: 0,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
    0
  );

  return (
    <Box p={4}>
      {cartItems.map((item) => (
        <Card
          key={item.id}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 2,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, borderRadius: 1 }}
            image={item.image}
            alt={item.name}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.price}
            </Typography>
          </CardContent>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => handleQuantityChange(item.id, -1)}>
              -
            </IconButton>
            <TextField
              size="small"
              value={item.quantity}
              sx={{ width: 50, mx: 1 }}
              inputProps={{ readOnly: true }}
            />
            <IconButton onClick={() => handleQuantityChange(item.id, 1)}>
              +
            </IconButton>
          </Box>
          <IconButton
            color="error"
            onClick={() => handleRemoveItem(item.id)}
            sx={{ ml: 2 }}
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      ))}
      <Box display="flex" justifyContent="space-between" mt={3} alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Total: Rp. {totalPrice.toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary">
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
