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

  // Define the sorting order for statuses
  const statusOrder = ["pending", "progress", "completed"];

  // Fetch data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/transaction/online/customer");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Sort orders based on statusOrder
  const sortedOrders = orders
    .filter((order) => filter === "All" || order.status === filter)
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

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
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="progress">On Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>

      {/* Order Cards */}
      <Box display="flex" flexDirection="column" gap="20px">
        {sortedOrders.map((order) => (
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
                  backgroundColor: (() => {
                    switch (order.status) {
                      case "pending":
                        return "#f9a825";
                      case "progress":
                        return "#2196f3";
                      case "completed":
                        return "#4caf50"; 
                      default:
                        return "#ccc";
                    }
                  })(),
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                {(() => {
                  switch (order.status) {
                    case "pending":
                      return "Sedang Disiapkan";
                    case "progress":
                      return "Sedang Dikirim";
                    case "completed":
                      return "Selesai";
                    default:
                      return "Unknown";
                  }
                })()}
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default StatusPage;
