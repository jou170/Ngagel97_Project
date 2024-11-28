import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Image from 'next/image'; // For optimized image rendering with Next.js

const UserNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#AB886D" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/image/Ngagel97Logo.png"
            alt="Ngagel97 Logo"
            width={50}
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
          <Link href="/home" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            HomePage
          </Link>
          <Link href="/order/status" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Order Status
          </Link>
          <Link href="/cart" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Cart
          </Link>
          <Link href="/transaction/history" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Transaction
          </Link>
          <Link href="/payment" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Payment
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;
