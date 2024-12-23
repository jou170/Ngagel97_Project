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
import { useRouter } from "next/navigation";

// Dynamically load MapComponent (SSR-safe)
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

const CheckoutPage = () => {
  const [cart, setCart] = useState([]); // Cart items
  const [user, setUser] = useState(null); // User info
  const [position, setPosition] = useState([-7.2891, 112.7578]); // Default coordinates
  const [address, setAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [snapToken, setSnapToken] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();
 
  // Fetch cart and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart data
        const cartResponse = await fetch("/api/cart");
        const cartData = await cartResponse.json();
        if (cartData.success) {
          setCart(cartData.data.items);


          const userResponse = await fetch(`/api/user/${cartData.data.userId}`);
          const userData = await userResponse.json();
          setUser(userData.data.user);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch address using reverse geocoding and calculate shipping cost
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const [lat, lng] = position;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setAddress(data.display_name || "Alamat tidak ditemukan");
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
            userLng: position[1],
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

    fetchAddress();
    calculateShipping();
  }, [position]);

  const handlePayment = async () => {
    console.log(user);
    
    try {
      const total = cart.reduce((sum, item) => sum + item.subtotal, 0) + shippingCost;
      console.log({
        userId: user._id,
        alamat: address,
        notes: notes,
        ongkir: shippingCost,
        subtotal: total-shippingCost,
        total: total,
        jasa: cart,
        user: user
      });
      
      // Call API to create Snap Token
      const response = await fetch("/api/midtrans/create_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          alamat: address,
          notes: notes,
          ongkir: shippingCost,
          subtotal: total-shippingCost,
          total: total,
          jasa: cart,
          user: user
        }),
      });

      if (!response.ok) throw new Error("Failed to create Snap Token");

      const { snapToken, transaksi_id } = await response.json();
      setSnapToken(snapToken);

      // // Call Snap.js to process payment
      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          console.log("Payment Success:", result);
          // alert("Pembayaran Berhasil!");
      
          try {
            // Panggil API untuk update transaksi
            const response = await fetch(`/api/transaction/online/${transaksi_id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "pending",
              }),
            });
      
            if (!response.ok) {
              throw new Error("Failed to update transaction");
            }
      
            const responseData = await response.json();
            console.log("Update Success:", responseData);

            const res2 = await fetch(`/api/cart`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });
      
            // Redirect ke halaman order setelah update berhasil
            router.push("/order");
          } catch (error) {
            console.error("Error updating transaction:", error.message);
            alert("Gagal memperbarui transaksi. Silakan coba lagi.");
          }
        },
        onPending: function (result) {
          console.log("Payment Pending:", result);
          alert("Pembayaran tertunda. Silakan selesaikan pembayaran Anda.");
        },
        onError: function (result) {
          console.error("Payment Error:", result);
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: async function () {
          alert("Transaksi dibatalkan.");
          try {
            // Panggil API untuk update transaksi
            const response = await fetch(`/api/transaction/online/${transaksi_id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "failed",
              }),
            });
      
            if (!response.ok) {
              throw new Error("Failed to update transaction");
            }
      
            const responseData = await response.json();
            console.log("Update Success:", responseData);
          } catch (error) {
            console.error("Error updating transaction:", error.message);
            alert("Gagal memperbarui transaksi. Silakan coba lagi.");
          }
        },
      });
    } catch (error) {
      console.error("Error handling payment:", error);
    }
  };

  // Load Midtrans Snap.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box display="flex" p={4} gap={4}>
      {/* Left Section */}
      <Box flex={1}>
        <Typography variant="h6" mb={2}>
          Informasi Pembeli
        </Typography>
        {user && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nama Pembeli"
              variant="outlined"
              fullWidth
              value={user.name}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Email Pembeli"
              variant="outlined"
              fullWidth
              value={user.email}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Nomor Handphone"
              variant="outlined"
              fullWidth
              value={user.phone_number || "-"}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </Box>

      {/* Right Section */}
      <Box flex={1}>
        <Typography variant="h6" mb={2}>
          Detail Produk
        </Typography>
        {cart.map((item, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body1">Nama: {item.nama}</Typography>
                <Typography variant="body2">Jumlah: {item.qty}</Typography>
                <Typography variant="body2">
                  Harga: Rp. {item.harga.toLocaleString()}
                </Typography>
                {item.addOns.length > 0 && (
                  <Typography variant="body2">
                    Add-Ons:{" "}
                    {item.addOns
                      .map(
                        (addOn) =>
                          `${addOn.nama} - ${addOn.harga} (x${addOn.qty})`
                      )
                      .join(", ")}
                  </Typography>
                )}

                <Typography variant="body2">
                  Subtotal: Rp. {item.subtotal.toLocaleString()}
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
                Total Harga ({cart.length} Produk):
              </Typography>
              <Typography variant="body2">
                Rp.{" "}
                {cart
                  .reduce((sum, item) => sum + item.subtotal, 0)
                  .toLocaleString()}
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
                Rp.{" "}
                {(
                  cart.reduce((sum, item) => sum + item.subtotal, 0) +
                  shippingCost
                ).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
          onClick={handlePayment}
        >
          Lanjut Pembayaran
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
