import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Image from "next/image";

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
        INI LIHAT ORDER NYA SEKALIGUS BISA DOWNLOAD FILE DLL
      </Typography>
    </Box>
  );
};

export default TransactionHistoryPage;
