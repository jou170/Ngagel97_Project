"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
} from "@mui/material";
import Link from "next/link";

const AddOnPage = () => {
  const [addOns, setAddOns] = useState([]);
  const [filteredAddOns, setFilteredAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch("/api/addon");
        const data = await response.json();
        setAddOns(data);
        setFilteredAddOns(data); // Awalnya semua data ditampilkan
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data add-ons:", error);
        setLoading(false);
      }
    };

    fetchAddOns();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = addOns.filter((addon) =>
        addon.nama.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredAddOns(filtered);
    }, 500); // Delay 500ms untuk performa

    return () => clearTimeout(delayDebounceFn); // Bersihkan timeout
  }, [searchQuery, addOns]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus add-on ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/addon/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data add-on.");
      }

      setAddOns((prevAddOns) =>
        prevAddOns.filter((addon) => addon.idAddon !== id)
      );
    } catch (error) {
      console.error("Gagal menghapus add-on:", error);
    }
  };

  if (loading) {
    return (
      <Typography
        variant="h5"
        align="center"
        sx={{ color: "gray", marginTop: 5 }}
      >
        Loading...
      </Typography>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}>
      {/* Header dan Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#333", textTransform: "uppercase" }}
        >
          Koleksi Add-On
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontWeight: "bold" }}
          >
            Search:
          </Typography>
          <TextField
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik nama add-on..."
            sx={{
              width: "100%",
              maxWidth: "300px",
              backgroundColor: "white",
            }}
          />
        </Box>
      </div>

      {/* Daftar Add-On */}
      <Grid2 container spacing={3} justifyContent="center" alignItems="stretch">
        {filteredAddOns.map((addon) => (
          <Grid2 key={addon.idAddon} xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", cursor: "pointer" }}>
              {addon.gambar && (
                <CardMedia
                  component="img"
                  height="200"
                  image={addon.gambar}
                  alt={addon.nama || "Gambar Addon"}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {addon.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Harga: Rp{addon.harga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipe Harga: {addon.tipeHarga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addon.deskripsi}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <Link href={`/master/addon/${addon.idAddon}`} passHref>
                    <Button variant="contained" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addon.idAddon);
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default AddOnPage;
