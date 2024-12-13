"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

const StatusPage = () => {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/transaction/online/customer");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.data.orders); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4e4d8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" mb={3} color="black">
        Status Pemesanan
      </Typography>

      {/* Dropdown Filter */}
      <Select
        value={filter}
        onChange={handleFilterChange}
        displayEmpty
        sx={{
          backgroundColor: "#fff",
          padding: "5px 10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="pending">Sedang Disiapkan</MenuItem>
        <MenuItem value="progress">Sedang Dikirim</MenuItem>
      </Select>

      {/* Order Cards */}
      <Box display="flex" flexDirection="column" gap="20px">
        {orders
          .filter(
            (order) =>
              filter === "All" || order.status === filter // Filter orders
          )
          .map((order) => (
            <Paper
              key={order._id}
              sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {/* Left: Order Details */}
              <Box>
                <Typography variant="h6">{`Order ID: ${order.idTransaksi}`}</Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                  Total: Rp {order.total}
                </Typography>
              </Box>

              {/* Right: Order Status */}
              <Box textAlign="right">
                <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                  {`Order ${order.status} pada ${new Date(
                    order.createdAt
                  ).toLocaleDateString()} ${new Date(
                    order.createdAt
                  ).toLocaleTimeString()}`}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      order.status === "pending" ? "#f9a825" : "#2196f3", // Yellow for pending, blue for progress
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor:
                        order.status === "pending" ? "#fbc02d" : "#1976d2",
                      opacity: 0.9,
                    },
                  }}
                >
                  {order.status === "pending"
                    ? "Sedang Disiapkan"
                    : "Sedang Dikirim"}
                </Button>
              </Box>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default StatusPage;
