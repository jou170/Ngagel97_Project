"use client";

import { AppBar, Toolbar, Box, Typography, Button, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminNavbar = () => {
  const router = useRouter();

  // Navigasi menggunakan router.push
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#AB886D" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo and Title */}
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
          <Button
            onClick={() => handleNavigation("/admin/transaction/history")}
            sx={{
              color: "#FFFFFF",
              fontSize: "18px",
              textTransform: "none",
            }}
          >
            Transaction History
          </Button>
          <Button
            onClick={() => handleNavigation("/admin/transaction/offline")}
            sx={{
              color: "#FFFFFF",
              fontSize: "18px",
              textTransform: "none",
            }}
          >
            Offline Transaction
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
