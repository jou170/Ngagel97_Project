"use client";

import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
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
            onClick={() => handleNavigation("/about")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            About
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/services")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Services
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/contact")}
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
