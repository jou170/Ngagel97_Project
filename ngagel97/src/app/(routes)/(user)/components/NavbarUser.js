"use client";

import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavbarUser = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        handleNavigation("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#AB886D" }}>
      <Toolbar sx={{ justifyContent: "space-between", paddingX: 2 }}>
        {/* Logo dan Judul */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/image/Ngagel97Logo.png" // Adjust the path if necessary
            alt="Fotocopy Vindi Logo"
            width={50}
            height={50}
            style={{ marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: "24px",
              fontFamily: "-moz-initial",
              color: "#FFFFFF",
            }}
          >
            Ngagel97
          </Typography>
        </Box>

        {/* Tombol Navigasi */}
        <Box>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/home")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/cart")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Cart
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/order")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Order
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/transaction/history")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Transaction
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/about")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            About
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarUser;
