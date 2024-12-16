"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const TransactionDetailPage = () => {
  const { id } = useParams(); // Mengambil ID order dari URL
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransaction = async () => {
    try {
      // Fetch Order Data
      const response = await fetch(`/api/transaction/online/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setOrder(data.data);

      // Fetch User Data
      const userResponse = await fetch(`/api/user/${data.data.userId}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setUser(userData.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (loading) return <CenterLoading />;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box
      sx={{
        backgroundColor: "#f4e4d8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Header dengan Back Button dan Judul Tengah */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <IconButton onClick={() => router.push("/admin/transaction/history")}>
          <ArrowBackIcon sx={{ color: "black" }} />
        </IconButton>
        <Typography variant="h4" color="black">
          Detail Riwayat Transaksi
        </Typography>
        <Box /> {/* Placeholder kosong untuk menjaga posisi */}
      </Box>

      {/* Informasi Order */}
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5">Order ID: {order._id}</Typography>
        <Typography variant="h6">Jenis Pesanan: {order.isOnline ? "Online" : "Offline"}</Typography>
        <Typography variant="body1">Customer: {user?.name || "-"}</Typography>
        <Typography variant="body1">
          Phone Number: {user?.phone_number || "-"}
        </Typography>
        <Typography variant="body1">Total: Rp. {order.total}</Typography>
        <Typography variant="body1">Alamat: {order.alamat || "-"}</Typography>
        <Typography variant="body1">Notes: {order.notes || "-"}</Typography>
      </Paper>

      {/* List Jasa dan Add-On */}
      <Box display="flex" flexDirection="column" gap="20px">
        {order.jasa.map((jasa, index) => (
          <Paper
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            {/* Kiri: Informasi Jasa dan Add-On */}
            <Box>
              <Typography variant="h6">{jasa.nama}</Typography>
              <Typography variant="body1">
                Harga: Rp. {jasa.harga} | Lembar: {jasa.lembar} | Qty:{" "}
                {jasa.qty}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "8px" }}>
                Notes: {jasa.notes}
              </Typography>

              {/* Tampilkan Add-On */}
              {jasa.addOns.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Add-Ons:
                  </Typography>
                  {jasa.addOns.map((addOn, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ ml: 2 }}
                    >
                      - {addOn.nama} | Harga: Rp. {addOn.harga} | Qty:{" "}
                      {addOn.qty} | Subtotal: Rp. {addOn.subtotal}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default TransactionDetailPage;
