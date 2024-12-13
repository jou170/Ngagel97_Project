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
  Tooltip,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useRouter } from "next/navigation"; // Import useRouter
import CenterLoading from "../components/CenterLoading";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Default sebagai array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.items) {
          setCartItems(data.data.items);
        }
      })
      .catch((error) => setError("Error fetching cart:", error))
      .finally(setLoading(false));
  }, []);

  const deleteFile = async (lastUrl) => {
    let filepath = lastUrl.replace(
      "https://mnyziu33qakbhpjn.public.blob.vercel-storage.com/",
      ""
    );

    await fetch(`/api/upload?filepath=${filepath}`, {
      method: "DELETE",
    });
  };

  const handleRemoveItem = async (id) => {
    // Delete file dulu
    try {
      await deleteFile(cartItems[id].file);
    } catch (error) {
      throw new Error("Cart item not found.");
    }

    const res = await fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // Update state to remove the deleted item
      setCartItems((prevItems) =>
        prevItems.filter((item, index) => index !== id)
      );
      alert("Cart item deleted successfully!");
    } else {
      alert("Failed to delete cart item.");
    }
  };

  const handleCheckout = () => {
    router.push("/checkout"); // Navigasi ke halaman checkout
  };

  const handleCardClick = (index) => {
    router.push(`/cart/${index}`); // Navigasi ke halaman detail berdasarkan index
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return <CenterLoading />;
  }

  if (error) return <Alert severity="error">{error}</Alert>;

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
              image={item.gambar}
              alt={item.nama}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{item.nama}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.notes ? "Notes: " + item.notes : "No notes provided"}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Price: Rp {item.subtotal.toLocaleString("id-ID")}
              </Typography>
              {item.addOns.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add-on(s) :{" "}
                  {item.addOns.map((addOn) => addOn.nama).join(", ")}
                </Typography>
              )}
            </CardContent>
            <Tooltip title="Attach File" sx={{ ml: 2 }}>
              <IconButton
                color="primary"
                component="a" // Mengubah IconButton menjadi elemen <a>
                href={item.file}
                target="_blank" // Membuka file di tab baru
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <Box
              display="flex"
              alignItems="center"
              onClick={(e) => e.stopPropagation()} // Hentikan propagasi klik ke card
            >
              <TextField
                size="small"
                value={item.qty}
                sx={{ width: 50 }}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Box>
            <Tooltip title="Delete" sx={{ ml: 2 }}>
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation(); // Hentikan klik propagasi ke card
                  handleRemoveItem(index); // Pass index to identify the item
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Card>
        ))
      ) : (
        <Typography variant="h6">Cart is empty.</Typography>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        mt={3}
        alignItems="center"
      >
        <Typography variant="h6" fontWeight="bold">
          Total: Rp {totalPrice.toLocaleString("id-ID")}
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
