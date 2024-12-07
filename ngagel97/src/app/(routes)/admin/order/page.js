import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Image from "next/image";

const orders = [
  {
    id: 1,
    // image: "https://via.placeholder.com/80x100", // Replace with your image URL
    title: "Order Title 1",
    total: "$50",
    date: "2024-11-01",
    time: "10:00 AM",
    status: "Delivered",
  },
  {
    id: 2,
    // image: "https://via.placeholder.com/80x100",
    title: "Order Title 2",
    total: "$30",
    date: "2024-11-02",
    time: "2:00 PM",
    status: "Delivered",
  },
];

const TransactionHistoryPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f4e4d8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" mb={3} color="black">
        INI NANTI TAMPILKAN SEMUA PESANAN YANG BELUM SELESAI
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
              {/* Use img tag if not using Next.js */}
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
