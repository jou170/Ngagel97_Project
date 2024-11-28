import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Image from 'next/image'; // For optimized image rendering with Next.js

const Navbar = () => {
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
          <Link href="/user/homepage" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            HomePage
          </Link>
          <Link href="/user/order/status" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Order Status
          </Link>
          <Link href="/user/cart" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Cart
          </Link>
          <Link href="/user/transaction/history" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Transaction
          </Link>
          <Link href="/user/payment" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            Payment
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
