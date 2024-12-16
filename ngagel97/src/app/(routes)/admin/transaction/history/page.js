"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const TransactionHistoryPage = () => {
  const [orders, setOrders] = useState([]); // State untuk menyimpan data transaksi
  const [loading, setLoading] = useState(true); // State untuk loading indicator
  const [error, setError] = useState(null); // State untuk menampilkan error
  const router = useRouter();

  // Fetch data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction/online/admin/history");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setOrders(data.data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  if (loading) {
    return <CenterLoading />;
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" mb={3} color="black">
        Riwayat Transaksi
      </Typography>
      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Tampilkan Data Transaksi */}
      <Box display="flex" flexDirection="column" gap="20px">
        {orders.length > 0
          ? orders.map((order) => (
              <Paper
                key={order._id}
                onClick={() => router.push(`/admin/transaction/history/${order._id}`)} // Navigasi ke halaman detail
                sx={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer", // Menunjukkan bahwa elemen bisa diklik
                  "&:hover": {
                    backgroundColor: "#f5f5f5", // Efek hover
                  },
                }}
              >
                {/* Kiri: Detail Produk */}
                <Box display="flex" alignItems="center" gap="15px">
                  {order.image ? (
                    <Image
                      src={order.image}
                      alt={order.title}
                      width={80}
                      height={100}
                      style={{ borderRadius: "4px" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "80px",
                        height: "100px",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6">{order._id}</Typography>
                    <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                      Total: {order.total}
                    </Typography>
                  </Box>
                </Box>

                {/* Kanan: Status Pesanan */}
                <Box textAlign="right">
                  <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                    Order on{" "}
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      timeZone: "Asia/Jakarta",
                    })}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#fb8c00",
                      },
                    }}
                  >
                    {order.isOnline ? "Online" : "Offline"}
                  </Button>
                </Box>
              </Paper>
            ))
          : !loading && (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                Tidak ada riwayat transaksi.
              </Typography>
            )}
      </Box>
    </Box>
  );
};

export default TransactionHistoryPage;
