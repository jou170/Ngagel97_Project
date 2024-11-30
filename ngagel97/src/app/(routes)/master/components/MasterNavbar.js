"use client"; // Add this at the top of your file

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const MasterNavbar = () => {
  // Separate state variables for each menu
  const [productsAnchorEl, setProductsAnchorEl] = useState(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState(null);
  const [addOnAnchorEl, setAddOnAnchorEl] = useState(null);
  const [reportsAnchorEl, setReportsAnchorEl] = useState(null);

  // Handlers for "Products" menu
  const handleProductsMenuOpen = (event) => setProductsAnchorEl(event.currentTarget);
  const handleProductsMenuClose = () => setProductsAnchorEl(null);

  // Handlers for "Services" menu
  const handleServicesMenuOpen = (event) => setServicesAnchorEl(event.currentTarget);
  const handleServicesMenuClose = () => setServicesAnchorEl(null);

  // Handlers for "Add On" menu
  const handleAddOnMenuOpen = (event) => setAddOnAnchorEl(event.currentTarget);
  const handleAddOnMenuClose = () => setAddOnAnchorEl(null);

  // Handlers for "Reports" menu
  const handleReportsMenuOpen = (event) => setReportsAnchorEl(event.currentTarget);
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
            sx={{ color: "#FFFFFF", fontSize: "24px", fontFamily: "-moz-initial" }}
          >
            Ngagel97
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Products Dropdown Menu */}
          <Button
            sx={{ color: "#FFFFFF", fontSize: "18px" }}
            onClick={handleProductsMenuOpen}
          >
            Products
          </Button>
          <Menu
            anchorEl={productsAnchorEl}
            open={Boolean(productsAnchorEl)}
            onClose={handleProductsMenuClose}
          >
            <MenuItem onClick={handleProductsMenuClose} component="a" href="/master/product/items">
              Items
            </MenuItem>
            <MenuItem onClick={handleProductsMenuClose} component="a" href="/master/product/add">
              Add Items
            </MenuItem>
          </Menu>

          {/* Services Dropdown Menu */}
          <Button
            sx={{ color: "#FFFFFF", fontSize: "18px" }}
            onClick={handleServicesMenuOpen}
          >
            Services
          </Button>
          <Menu
            anchorEl={servicesAnchorEl}
            open={Boolean(servicesAnchorEl)}
            onClose={handleServicesMenuClose}
          >
            <MenuItem onClick={handleServicesMenuClose} component="a" href="/master/service/items">
              Services
            </MenuItem>
            <MenuItem onClick={handleServicesMenuClose} component="a" href="/master/service/add">
              Add Services
            </MenuItem>
          </Menu>

          {/* Add On Dropdown Menu */}
          <Button
            sx={{ color: "#FFFFFF", fontSize: "18px" }}
            onClick={handleAddOnMenuOpen}
          >
            Add On
          </Button>
          <Menu
            anchorEl={addOnAnchorEl}
            open={Boolean(addOnAnchorEl)}
            onClose={handleAddOnMenuClose}
          >
            <MenuItem onClick={handleAddOnMenuClose} component="a" href="/master/addon/items">
              AddOn
            </MenuItem>
            <MenuItem onClick={handleAddOnMenuClose} component="a" href="/master/addon/add">
              Add AddOn
            </MenuItem>
          </Menu>

          {/* Reports Dropdown Menu */}
          <Button
            sx={{ color: "#FFFFFF", fontSize: "18px" }}
            onClick={handleReportsMenuOpen}
          >
            Reports
          </Button>
          <Menu
            anchorEl={reportsAnchorEl}
            open={Boolean(reportsAnchorEl)}
            onClose={handleReportsMenuClose}
          >
            <MenuItem onClick={handleReportsMenuClose} component="a" href="/master/report/sales">
              Laporan Penjualan
            </MenuItem>
            <MenuItem onClick={handleReportsMenuClose} component="a" href="/master/report/daily">
              Laporan Transaksi Harian
            </MenuItem>
            <MenuItem onClick={handleReportsMenuClose} component="a" href="/master/report/delivery">
              Laporan Pengiriman
            </MenuItem>
          </Menu>

          <Link href="/master/status" underline="none" sx={{ color: "#FFFFFF", fontSize: "18px" }}>
            User Status
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MasterNavbar;
