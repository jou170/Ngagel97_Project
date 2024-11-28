"use client";

import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavbarPublic = () => {
  const router = useRouter();

  // Navigasi menggunakan router.push
  const handleNavigation = (path) => {
    router.push(path);
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
            onClick={() => handleNavigation("/product")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Product
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/login")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarPublic;
