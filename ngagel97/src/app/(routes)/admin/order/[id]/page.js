"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
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

  const updateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/transaction/online/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      const updatedOrder = await response.json();

      if (newStatus === "completed") {
        router.push("/admin/order"); // Redirect ke halaman admin/order jika completed
      } else {
        fetchTransaction(); // Fetch ulang untuk memperbarui status
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    }
  };

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
        <IconButton onClick={() => router.push("/admin/order")}>
          <ArrowBackIcon sx={{ color: "black" }} />
        </IconButton>
        <Typography variant="h4" color="black">
          Detail Order
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
        <Typography variant="h6">Order ID: {order._id}</Typography>
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
        {order.jasa.map((jasa) => (
          <Paper
            key={jasa.jasaId}
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
                  {jasa.addOns.map((addOn) => (
                    <Typography
                      key={addOn.addOnId}
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

            {/* Kanan: Tombol Download File */}
            <Tooltip title="Download File">
              <IconButton
                color="primary"
                onClick={() => window.open(jasa.file, "_blank")} // Membuka file PDF
                sx={{
                  backgroundColor: "#007BFF",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                <DownloadIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Box>

      {/* Tombol Status Order */}
      <Box mt={4} textAlign="center">
        {order.status === "pending" && (
          <Button
            variant="contained"
            color="warning"
            sx={{ textTransform: "none", backgroundColor: "#FFA500" }}
            onClick={() => updateOrderStatus("progress")}
          >
            Deliver Order
          </Button>
        )}
        {order.status === "progress" && (
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none", backgroundColor: "#28a745" }}
            onClick={() => updateOrderStatus("completed")}
          >
            Complete Order
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TransactionDetailPage;
