'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import DetailOrder from "../../(public)/components/DetailOrder";

const UserOrderPage = () => {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleDetailClick = (idTransaksi) => {
    const order = orders.find((o) => o.idTransaksi === idTransaksi);
    if (!order) {
      alert("Order not found. Please check the ID or ensure the order exists.");
    } else {
      setSelectedOrder(order);
    }
  };

  // Menghitung total lembar dengan menjumlahkan nilai 'lembar' di setiap jasa
  const calculateTotalLembar = (jasa) => {
    return jasa.reduce((total, item) => total + item.lembar, 0);
  };

  const sortedOrders = orders
    .filter((order) => filter === "All" || order.status === filter)
    .sort((a, b) => a.status.localeCompare(b.status));

  return (
    <Box sx={{ backgroundColor: "#f4e4d8", minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h4" mb={3} color="black">
        Status Pemesanan
      </Typography>

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

      <Box display="flex" flexDirection="column" gap="20px">
        {sortedOrders.map((order) => (
          <Paper
            key={order.idTransaksi}
            sx={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="h6">{`Order ID: ${order.idTransaksi}`}</Typography>
              <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                Total: Rp.{order.total}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Jumlah Lembar: {calculateTotalLembar(order.jasa)} lembar
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Ongkir: Rp.{order.ongkir || "0"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Total Tanpa Ongkir: Rp.{order.total - (order.ongkir || 0)}
              </Typography>
            </Box>

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
                        return `Pending`;
                      case "progress":
                        return `Progress`;
                      case "completed":
                        return `Completed`;
                      default:
                        return "Status Tidak Diketahui";
                    }
                  })()}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleDetailClick(order.idTransaksi)}
                >
                  Detail
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Box>
  );
};

export default UserOrderPage;
