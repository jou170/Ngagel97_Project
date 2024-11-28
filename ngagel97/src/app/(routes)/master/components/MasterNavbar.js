import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Image from 'next/image'; // For optimized image rendering with Next.js

const MasterNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#AB886D" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/image/Ngagel97Logo.png" // Update the path if necessary
            alt="Ngagel97 Logo"
            width={50} // Adjust the size as needed
            height={50}
            style={{ marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            component="span"
            sx={{ color: "#FFFFFF", fontSize: "24px", fontFamily: "-moz-initial" }}
          >
            Ngagel97
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/master/product" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Product
          </Link>
          <Link href="/master/report/sales" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Laporan Penjualan
          </Link>
          <Link href="/master/report/daily" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Laporan Transaksi Harian
          </Link>
          <Link href="/master/report/delivery" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Laporan Pengiriman
          </Link>
          <Link href="/master/status" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            User Status
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MasterNavbar;
