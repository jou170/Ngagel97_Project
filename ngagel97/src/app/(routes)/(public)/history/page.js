"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

const TransactionHistoryPage = () => {
  const [histories, setHistories] = useState([]);

  // Fetch data from backend endpoint
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await fetch("/api/transaction/online/customer/history");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        
        setHistories(data.data.histories); // Assuming the response is an array of history items
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      }
    };

    fetchHistories();
  }, []);

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

      {/* Transaction History Cards */}
      <Box display="flex" flexDirection="column" gap="20px">
        {histories.length > 0 ? (
          histories.map((history) => (
            <Paper
              key={history._id}
              sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {/* Left: Transaction Details */}
              <Box>
                <Typography variant="h6">
                  {`Order ID: ${history.idTransaksi}`}
                </Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                  Total: Rp {history.total}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                  {`Tanggal: ${new Date(history.createdAt).toLocaleDateString()} 
                  ${new Date(history.createdAt).toLocaleTimeString()}`}
                </Typography>
              </Box>

              {/* Right: Detail Button */}
              <Box textAlign="right">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4caf50", // Green button for detail
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#45a049",
                      opacity: 0.9,
                    },
                  }}
                >
                  Detail
                </Button>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" color="gray">
            Tidak ada riwayat pemesanan.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TransactionHistoryPage;
