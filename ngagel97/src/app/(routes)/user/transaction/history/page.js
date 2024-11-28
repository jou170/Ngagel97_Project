"use client";

import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Image from "next/image";

const TransactionHistoryPage = () => {
  const orders = [
    {
      id: 1,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      total: "Rp. 50,000,-",
      date: "13/12/2012",
      time: "15:33 PM",
      status: "Selesai",
      image: "/book-thumbnail.png",
    },
    {
      id: 2,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      total: "Rp. 50,000,-",
      date: "13/12/2012",
      time: "15:33 PM",
      status: "Selesai",
      image: "/book-thumbnail.png",
    },
    {
      id: 3,
      title: "Jilid A4 Buku tesis Proposal Software Development Project",
      total: "Rp. 50,000,-",
      date: "13/12/2012",
      time: "15:33 PM",
      status: "Selesai",
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
        Riwayat Pemesanan
      </Typography>

      <Box display="flex" flexDirection="column" gap="20px">
        {orders.map((order) => (
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
                Order has arrived since {order.date}, {order.time}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#45a049",
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

export default TransactionHistoryPage;
