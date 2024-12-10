"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Box,
} from "@mui/material";
import Image from "next/image";
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
        setFilteredAddOns(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Gagal mengambil data add-ons:", error);
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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, addOns]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus add-on ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/addon/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Gagal menghapus data add-on.");
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
      <Box
        sx={{
          backgroundColor: "#AB886D",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "white",
              textTransform: "uppercase",
              marginTop: "10px",
            }}
          >
            Koleksi Add-On
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.location.href = "/master/addon/add";
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#493628",
                fontSize: "16px",
                padding: "12px 36px",
                "&:hover": {
                  backgroundColor: "#493628",
                },
              }}
            >
              Add Add-on
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Search:
              </Typography>
              <TextField
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama add-on..."
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
          </Box>
        </div>
      </Box>

      {/* Daftar Add-On */}
      <Grid2
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {filteredAddOns.map((addon) => (
          <Grid2 key={addon.idAddon} xs={12} sm={6} md={3}>
            <Card sx={{ width: 380, height: 450 }}>
              {addon.gambar ? (
                <Image
                  src={addon.gambar}
                  alt={addon.nama || "Gambar Addon"}
                  width={380}
                  height={200}
                  style={{
                    objectFit: "cover",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                />
              ) : (
                <Image
                  src="/image/380x200.png" // Use the local placeholder image
                  alt="Gambar Addon"
                  width={380}
                  height={200}
                  style={{
                    objectFit: "cover",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                />
              )}
              <CardContent sx={{ padding: "16px", flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {addon.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Harga: Rp{addon.harga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipe Harga: {addon.tipeHarga}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: "8px" }}
                >
                  Deskripsi :{" "}
                  {addon.deskripsi
                    ? addon.deskripsi.split(" ").slice(0, 5).join(" ") +
                      (addon.deskripsi.split(" ").length > 5 ? "..." : "")
                    : "Deskripsi tidak tersedia"}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "16px",
                  }}
                >
                  <Link href={`/master/addon/${addon.idAddon}`} passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ marginRight: "10px" }}
                    >
                      Detail
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
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
