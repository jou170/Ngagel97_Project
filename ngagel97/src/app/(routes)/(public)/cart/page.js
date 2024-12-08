"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation"; // Import useRouter

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Default sebagai array
  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.items) {
          setCartItems(data.data.items);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, []);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.jasaId === id
          ? { ...item, qty: Math.max(item.qty + delta, 0) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.jasaId !== id)
    );
  };

  const handleCheckout = () => {
    router.push("/checkout"); // Navigasi ke halaman checkout
  };

  const handleCardClick = (index) => {
    router.push(`/cart/${index}`); // Navigasi ke halaman detail berdasarkan index
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Box p={4}>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(index)} // Navigasi saat card ditekan
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: 2,
              boxShadow: 2,
              borderRadius: 2,
              cursor: "pointer", // Tambahkan pointer untuk UX lebih baik
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 100, height: 100, borderRadius: 1 }}
              image={item.file || "/placeholder.png"}
              alt={item.nama}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{item.nama}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.notes || "No notes provided"}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Harga: Rp. {item.subtotal.toFixed(2)}
              </Typography>
              {item.addOns.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add-ons: {item.addOns.map((addOn) => addOn.nama).join(", ")}
                </Typography>
              )}
            </CardContent>
            <Box
              display="flex"
              alignItems="center"
              onClick={(e) => e.stopPropagation()} // Hentikan propagasi klik ke card
            >
              <IconButton onClick={() => handleQuantityChange(item.jasaId, -1)}>
                -
              </IconButton>
              <TextField
                size="small"
                value={item.qty}
                sx={{ width: 50, mx: 1 }}
                inputProps={{ readOnly: true }}
              />
              <IconButton onClick={() => handleQuantityChange(item.jasaId, 1)}>
                +
              </IconButton>
            </Box>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // Hentikan klik propagasi ke card
                handleRemoveItem(item.jasaId);
              }}
              sx={{ ml: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))
      ) : (
        <Typography variant="h6">Cart is empty.</Typography>
      )}
      <Box display="flex" justifyContent="space-between" mt={3} alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Total: Rp. {totalPrice.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout} // Panggil handleCheckout saat tombol ditekan
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
