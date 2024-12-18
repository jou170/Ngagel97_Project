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
import { useRouter } from "next/navigation";

const StatusPage = () => {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const router = useRouter();

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

  const handleDetailClick = (id) => {
    router.push(`/order/${id}`);
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
                Total: Rp.{order.total}
              </Typography>
            </Box>

            {/* Right: Order Status */}
            <Box textAlign="right" display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                {`Order ${order.status} pada ${new Date(
                  order.createdAt
                ).toLocaleDateString()} ${new Date(
                  order.createdAt
                ).toLocaleTimeString()}`}
              </Typography>
              <Box display="flex" gap="10px" justifyContent="flex-end">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: (() => {
                      switch (order.status) {
                        case "pending":
                          return "#f9a825"; // Yellow for pending
                        case "progress":
                          return "#2196f3"; // Blue for progress
                        case "completed":
                          return "#4caf50"; // Green for completed
                        default:
                          return "#ccc"; // Grey for unknown
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
                        return `Sedang Disiapkan`;
                      case "progress":
                        return `Sedang`;
                      case "completed":
                        return `Selesai`;
                      default:
                        return "Status Tidak Diketahui";
                    }
                  })()}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#000",
                    borderColor: "#ccc",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() => handleDetailClick(order.idTransaksi)} // Navigate to detail page
                >
                  Detail
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default StatusPage;
