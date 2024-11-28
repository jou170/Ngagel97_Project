"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const navItemStyle = {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  };

  const navItemHoverStyle = {
    backgroundColor: "#916d57",
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div>
      <nav
        style={{
          backgroundColor: "#AB886D",
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <img
          src="../../../../image/Ngagel97Logo.png"
          alt="Ngagel97 Logo"
          style={{
            width: "50px",
            height: "auto",
            marginRight: "15px",
          }}
        />
        <span style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
          Ngagel97
        </span>

        {/* Navbar Items */}
        <div style={{ display: "flex", gap: "20px", marginLeft: "auto" }}>
          <span
            style={navItemStyle}
            onClick={() => handleNavigation("/master/list/product")}
          >
            Edit Produk
          </span>
          <span
            style={navItemStyle}
            onClick={() => handleNavigation("/master/report/sales")}
          >
            Laporan Penjualan
          </span>
          <span
            style={navItemStyle}
            onClick={() => handleNavigation("/master/report/daily")}
          >
            Laporan Transaksi Harian
          </span>
          <span
            style={navItemStyle}
            onClick={() => handleNavigation("/master/report/delivery")}
          >
            Laporan Pengiriman
          </span>
          <span
            style={navItemStyle}
            onClick={() => handleNavigation("/master/status/admin")}
          >
            Edit Pengguna
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
