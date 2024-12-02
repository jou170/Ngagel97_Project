"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically load MapComponent (SSR-safe)
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

const CheckoutPage = () => {
  const dummyData = [
    { id: 1, name: "Print Kertas HVS (1 Lembar)", price: 10000 },
    { id: 2, name: "Print Kertas Folio (1 Lembar)", price: 10000 },
    { id: 3, name: "Print Kertas Folio Berwarna (1 Lembar)", price: 10000 },
  ];

  const totalItems = dummyData.length;
  const totalPrice = dummyData.reduce((sum, item) => sum + item.price, 0);

  const [position, setPosition] = useState([-7.2891, 112.7578]); // Default Jakarta coordinates
  const [address, setAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  // Fetch address using reverse geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const [lat, lng] = position;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        setAddress(response.data.display_name || "Alamat tidak ditemukan");
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Gagal mendapatkan alamat");
      }
    };

    const calculateShipping = async () => {
      try {
        const response = await fetch("/api/shipping", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userLat: position[0],
            userLng: position[1]
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to calculate shipping");
        }
    
        const data = await response.json();
        setShippingCost(data.shippingCost);
      } catch (error) {
        console.error("Error calculating shipping cost:", error);
      }
    };
    calculateShipping();
    fetchAddress();
  }, [position]);

  return (
    <Box display="flex" p={4} gap={4}>
      {/* Left Section */}
      <Box flex={1}>
        <Typography variant="h6" mb={2}>
          Informasi Pembeli
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Email Pembeli" variant="outlined" fullWidth />
          <TextField label="Nomor Handphone" variant="outlined" fullWidth />
          <TextField label="Input Alamat Manual" variant="outlined" fullWidth />

          {/* Map */}
          <Box height={300} borderRadius={1} overflow="hidden" mb={2}>
            <MapComponent position={position} onLocationChange={setPosition} />
          </Box>

          <TextField
            label="Alamat Terpilih"
            variant="outlined"
            fullWidth
            value={address}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            label="Catatan"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </Box>

      {/* Right Section */}
      <Box flex={1}>
        <Typography variant="h6" mb={2}>
          Detail Produk
        </Typography>
        {dummyData.map((item) => (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">
                  Harga: Rp. {item.price.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Typography variant="h6" mt={4} mb={2}>
          Ringkasan Harga
        </Typography>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Total Harga ({totalItems} Produk):
              </Typography>
              <Typography variant="body2">
                Rp. {totalPrice.toLocaleString()}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
  <Typography variant="body2">Ongkos Kirim:</Typography>
  <Typography variant="body2">
    Rp. {shippingCost.toLocaleString()}
  </Typography>
</Box>

            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Total Tagihan:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Rp. {(totalPrice + shippingCost).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
        >
          Lanjut Pembayaran
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
