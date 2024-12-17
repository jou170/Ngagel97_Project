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
import { useRouter } from "next/navigation";
import CenterLoading from "../../(public)/components/CenterLoading";

const DashboardPage = () => {
  const [recentOrders, setRecentOrders] = useState([]); // 3 recent orders
  const [recentHistory, setRecentHistory] = useState([]); // 3 recent history
  const [users, setUsers] = useState({}); // Map untuk menyimpan user data
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error handling
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch orders data
        const orderResponse = await fetch("/api/transaction/online/admin");
        if (!orderResponse.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderResponse.json();
        const recentOrdersData = orderData.data.orders.slice(0, 3);

        // Fetch history data
        const historyResponse = await fetch(
          "/api/transaction/online/admin/history"
        );
        if (!historyResponse.ok) throw new Error("Failed to fetch history");
        const historyData = await historyResponse.json();
        const recentHistoryData = historyData.data.orders.slice(0, 3);

        // Extract unique userIds
        const userIds = [
          ...new Set([
            ...recentOrdersData.map((order) => order.userId),
            ...recentHistoryData.map((history) => history.userId),
          ]),
        ];

        // Fetch user data for each userId
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
        setRecentOrders(recentOrdersData);
        setRecentHistory(recentHistoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <CenterLoading />;

  return (
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      {/* Judul Dashboard */}
      <Typography variant="h4" mb={3} color="black" fontWeight="bold">
        DASHBOARD
      </Typography>

      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Recent Orders Section */}
      <Typography variant="h6" mb={2} fontWeight="bold">
        Recent Orders
      </Typography>
      <Box display="flex" flexDirection="column" gap="15px" mb={3}>
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <Paper
              key={order._id}
              onClick={() => router.push(`/admin/order/${order._id}`)} // Navigasi ke halaman detail order
              sx={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              <Box>
                <Typography variant="body1">
                  {users[order.userId]?.name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.alamat}
                </Typography>
              </Box>
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
            </Paper>
          ))
        ) : (
          <Typography color="textSecondary">No recent orders.</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => router.push("/admin/order")}
        sx={{ marginBottom: 5, width: 1315 }}
      >
        View All Orders
      </Button>

      {/* Recent Transaction History Section */}
      <Typography variant="h6" mb={2} fontWeight="bold">
        Recent Transaction History
      </Typography>
      <Box display="flex" flexDirection="column" gap="15px" mb={3}>
        {recentHistory.length > 0 ? (
          recentHistory.map((history) => (
            <Paper
              key={history._id}
              onClick={() =>
                router.push(`/admin/transaction/history/${history._id}`)
              } // Navigasi ke halaman detail history
              sx={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              <Box>
                <Typography variant="body1">
                  {users[history.userId]?.name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {history.alamat || "No address"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: history.isOnline ? "#4caf50" : "#ff9800",
                }}
              >
                {history.isOnline ? "Online" : "Offline"}
              </Button>
            </Paper>
          ))
        ) : (
          <Typography color="textSecondary">No recent history.</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => router.push("/admin/transaction/history")}
        sx={{width: 1315}}
      >
        View Transaction History
      </Button>
    </Box>
  );
};

export default DashboardPage;
