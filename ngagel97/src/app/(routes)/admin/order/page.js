"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import CenterLoading from "../../(public)/components/CenterLoading";

const TransactionOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction/online/admin");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        const sortedOrders = data.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);

        const userIds = [
          ...new Set(data.data.orders.map((order) => order.userId)),
        ];
        const userPromises = userIds.map((userId) =>
          fetch(`/api/user/${userId}`).then((res) =>
            res.ok ? res.json() : Promise.reject("Failed to fetch user data")
          )
        );
        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc, userData) => {
          acc[userData.data.user._id] = userData.data.user;
          return acc;
        }, {});

        setUsers(usersMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const groupOrdersByDate = (orders) => {
    return orders.reduce((grouped, order) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
      return grouped;
    }, {});
  };

  if (loading) {
    return <CenterLoading />;
  }

  const groupedOrders = groupOrdersByDate(orders);
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" mb={3} color="black" fontWeight="bold">
        ORDERS
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {Object.keys(groupedOrders).map((date) => (
        <Box key={date} mb={4}>
          <Typography variant="h5" color="black" mb={2}>
            {date}
          </Typography>
          <Box display="flex" flexDirection="column" gap="20px">
            {groupedOrders[date].map((order) => (
              <Paper
                key={order._id}
                onClick={() => router.push(`/admin/order/${order._id}`)}
                sx={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap="15px">
                  <Box>
                    <Typography variant="h6">{`Pembelian Oleh : ${
                      users[order.userId]?.name || "-"
                    }`}</Typography>
                    <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                      Alamat: {order.alamat}
                    </Typography>
                  </Box>
                </Box>

                <Box textAlign="right">
                  <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                    Pembelian pada{" "}
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
                      width: 100,
                      backgroundColor:
                        order.status === "pending"
                          ? "#D64649"
                          : order.status === "progress"
                          ? "#FFB340"
                          : "#36B93C",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          order.status === "pending"
                            ? "#D61A1E"
                            : order.status === "progress"
                            ? "#FB9903"
                            : "#00AD08",
                      },
                    }}
                  >
                    {order.status.toUpperCase()}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      ))}

      {orders.length === 0 && (
        <Typography variant="body1" color="textSecondary" textAlign="center">
          Tidak ada pesanan yang belum selesai.
        </Typography>
      )}
    </Box>
  );
};

export default TransactionOrderPage;
