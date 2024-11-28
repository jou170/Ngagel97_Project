"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Button, Select, MenuItem } from "@mui/material";
import Image from "next/image";

const StatusPage = () => {
  const [filter, setFilter] = useState("Semua Produk");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const orders = [
    {
      id: 1,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      status: "Dalam Proses",
      total: "Rp. 50,000,-",
      date: "12/12/2012",
      time: "14:21 PM",
      statusColor: "#f9a825", // Yellow
      image: "/book-thumbnail.png",
    },
    {
      id: 2,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      status: "Selesai",
      total: "Rp. 50,000,-",
      date: "13/12/2012",
      time: "15:33 PM",
      statusColor: "#4caf50", // Green
      image: "/book-thumbnail.png",
    },
    {
      id: 3,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      status: "Belum Dibayar",
      total: "Rp. 50,000,-",
      date: "11/12/2012",
      time: "08:00 AM",
      statusColor: "#f44336", // Red
      image: "/book-thumbnail.png",
    },
  ];

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
        <MenuItem value="Semua Produk">Semua Produk</MenuItem>
        <MenuItem value="Dalam Proses">Dalam Proses</MenuItem>
        <MenuItem value="Selesai">Selesai</MenuItem>
        <MenuItem value="Belum Dibayar">Belum Dibayar</MenuItem>
      </Select>

      {/* Order Cards */}
      <Box display="flex" flexDirection="column" gap="20px">
        {orders
          .filter(
            (order) =>
              filter === "Semua Produk" || order.status === filter
          )
          .map((order) => (
            <Paper
              key={order.id}
              sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {/* Left: Product Details */}
              <Box display="flex" alignItems="center" gap="15px">
                <Image
                  src={order.image}
                  alt={order.title}
                  width={80}
                  height={100}
                  style={{ borderRadius: "4px" }}
                />
                <Box>
                  <Typography variant="h6">{order.title}</Typography>
                  <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                    Total: {order.total}
                  </Typography>
                </Box>
              </Box>

              {/* Right: Order Status */}
              <Box textAlign="right">
                <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                  {order.status === "Selesai"
                    ? `Order has arrived since ${order.date}, ${order.time}`
                    : `Order ${order.status} since ${order.date}, ${order.time}`}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: order.statusColor,
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: order.statusColor,
                      opacity: 0.9,
                    },
                  }}
                >
                  {order.status}
                </Button>
              </Box>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default StatusPage;
