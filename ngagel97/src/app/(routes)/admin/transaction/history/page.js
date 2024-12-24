"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const TransactionHistoryPage = () => {
  const [orders, setOrders] = useState([]); // State for all transactions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [users, setUsers] = useState({}); // State for online users
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const onlineResponse = await fetch(
          "/api/transaction/online/admin/history"
        );
        if (!onlineResponse.ok) {
          throw new Error("Failed to fetch online transactions");
        }
        const onlineData = await onlineResponse.json();

        const combinedOrders = [
          ...onlineData.data.orders.map((order) => ({
            ...order,
            source: "online",
          })),
        ];
        setOrders(combinedOrders);

        // Fetch user data only for valid userIds
        const onlineUserPromises = onlineData.data.orders
          .filter((order) => order.userId) // Ensure userId exists
          .map((order) =>
            fetch(`/api/user/${order.userId}`)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          );
        const onlineUserResults = await Promise.all(onlineUserPromises);

        const onlineUserMap = {};
        onlineUserResults.forEach((userRes, index) => {
          if (userRes && userRes.data) {
            onlineUserMap[onlineData.data.orders[index].userId] =
              userRes.data.user;
          }
        });
        setUsers(onlineUserMap);
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
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h4" mb={3} color="black" fontWeight="bold">
        TRANSACTION HISTORY
      </Typography>

      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Display Transaction Data */}
      <Box display="flex" flexDirection="column" gap="20px">
        {orders.length > 0
          ? orders.map((order, index) => (
              <Paper
                key={order._id}
                onClick={
                  order.isOnline
                    ? () =>
                        router.push(`/admin/transaction/history/${order._id}`)
                    : () =>
                        router.push(
                          `/admin/transaction/history/offline/${order._id}`
                        )
                }
                sx={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {/* {console.log(order)} */}

                <Box display="flex" alignItems="center" gap="15px">
                  <Box>
                    <Typography variant="h6">
                      {order.isOnline === true
                        ? `Pembelian Oleh : ${
                            users[order.userId]?.name || "Unknown User"
                          }`
                        : `Pembelian Offline Dengan ID : ${order.idTransaksi}`}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                      {order.isOnline === true
                        ? `Alamat : ${order.alamat || "Alamat tidak tersedia"}`
                        : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box textAlign="right">
                  <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                    Pembelian pada{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          timeZone: "Asia/Jakarta",
                        })
                      : "Tanggal tidak tersedia"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: order.isOnline ? "#4caf50" : "#ff9800",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: order.isOnline ? "#388e3c" : "#fb8c00",
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
