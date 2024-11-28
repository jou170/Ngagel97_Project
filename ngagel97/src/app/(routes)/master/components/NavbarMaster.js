"use client";

import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavbarMaster = () => {
  const router = useRouter();

  // Navigasi menggunakan router.push
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#AB886D" }}>
      <Toolbar sx={{ justifyContent: "space-between", paddingX: 2 }}>
        {/* Logo dan Judul */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/image/Ngagel97Logo.png"
            alt="Ngagel97 Logo"
            width={50}
            height={50}
            style={{ marginRight: "15px" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: "24px",
              fontFamily: "-moz-initial",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            Ngagel97
          </Typography>
        </Box>

        {/* Tombol Navigasi */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/master/list/product")}
            sx={{
              color: "#FFFFFF",
              padding: "5px 10px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#916d57" },
            }}
          >
            Edit Produk
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/master/report/sales")}
            sx={{
              color: "#FFFFFF",
              padding: "5px 10px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#916d57" },
            }}
          >
            Laporan Penjualan
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/master/report/daily")}
            sx={{
              color: "#FFFFFF",
              padding: "5px 10px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#916d57" },
            }}
          >
            Laporan Transaksi Harian
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/master/report/delivery")}
            sx={{
              color: "#FFFFFF",
              padding: "5px 10px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#916d57" },
            }}
          >
            Laporan Pengiriman
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/master/status/admin")}
            sx={{
              color: "#FFFFFF",
              padding: "5px 10px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#916d57" },
            }}
          >
            Edit Pengguna
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarMaster;
