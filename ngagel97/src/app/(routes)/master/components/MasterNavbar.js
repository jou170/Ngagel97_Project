"use client"; // Add this at the top of your file

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const MasterNavbar = () => {
  // State untuk membuka dropdown menu
  const [productsAnchorEl, setProductsAnchorEl] = useState(null);
  const [reportsAnchorEl, setReportsAnchorEl] = useState(null);

  // Handler untuk membuka dan menutup menu produk
  const handleProductsMenuOpen = (event) =>
    setProductsAnchorEl(event.currentTarget);
  const handleProductsMenuClose = () => setProductsAnchorEl(null);

  // Handler untuk membuka dan menutup menu laporan
  const handleReportsMenuOpen = (event) =>
    setReportsAnchorEl(event.currentTarget);
  const handleReportsMenuClose = () => setReportsAnchorEl(null);

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
            sx={{
              color: "#FFFFFF",
              fontSize: "24px",
              fontFamily: "-moz-initial",
            }}
          >
            Ngagel97
          </Typography>
        </Box>

        {/* Navigasi */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Menu Produk */}
          <Button
            sx={{ color: "#FFFFFF", marginX: 1 }}
            onClick={handleProductsMenuOpen}
          >
            Produk
          </Button>
          <Menu
            anchorEl={productsAnchorEl}
            open={Boolean(productsAnchorEl)}
            onClose={handleProductsMenuClose}
          >
            <MenuItem
              onClick={handleProductsMenuClose}
              component="a"
              href="/master/item"
            >
              Barang
            </MenuItem>
            <MenuItem
              onClick={handleProductsMenuClose}
              component="a"
              href="/master/service"
            >
              Jasa
            </MenuItem>
            <MenuItem
              onClick={handleProductsMenuClose}
              component="a"
              href="/master/addon"
            >
              Add-On
            </MenuItem>
          </Menu>

          {/* Menu Laporan */}
          <Button
            sx={{ color: "#FFFFFF", marginX: 1 }}
            onClick={handleReportsMenuOpen}
          >
            Laporan
          </Button>
          <Menu
            anchorEl={reportsAnchorEl}
            open={Boolean(reportsAnchorEl)}
            onClose={handleReportsMenuClose}
          >
            <MenuItem
              onClick={handleReportsMenuClose}
              component="a"
              href="/master/report/sales"
            >
              Laporan Penjualan
            </MenuItem>
            <MenuItem
              onClick={handleReportsMenuClose}
              component="a"
              href="/master/report/daily"
            >
              Laporan Transaksi Harian
            </MenuItem>
            <MenuItem
              onClick={handleReportsMenuClose}
              component="a"
              href="/master/report/delivery"
            >
              Laporan Pengiriman
            </MenuItem>
          </Menu>

          {/* Link ke User Status */}
          <Link
            href="/master/status"
            underline="none"
            sx={{ color: "#FFFFFF", marginX: 1 }}
          >
            USER
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MasterNavbar;
