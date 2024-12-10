"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/barang");
        const data = await response.json();
        setItems(data);
        setFilteredItems(data); // Awalnya semua data ditampilkan
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error("Gagal mengambil data barang:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = items.filter((item) =>
        item.nama.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredItems(filtered);
    }, 500); // Delay 500ms untuk debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, items]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus barang ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/barang/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data barang.");
      }

      setItems((prevItems) => prevItems.filter((item) => item.idBarang !== id));
    } catch (error) {
      throw new Error("Gagal menghapus barang:", error);
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
    <Box
      sx={{ padding: "20px", backgroundColor: "#D6C0B3", minHeight: "100vh" }}
    >
      {/* Kotak Header */}
      <Box
        sx={{
          backgroundColor: "#AB886D",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
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
            Koleksi Barang
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.location.href = "/master/item/add";
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
              Add Barang
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
                placeholder="Ketik nama barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        </Box>
      </Box>

      {/* Daftar Barang */}
      <Grid2 container spacing={4} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid2 key={item.idBarang} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ width: 380, height: 180 }}>
              <CardContent sx={{ padding: 2 }}>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ color: "#5A4634", fontWeight: "bold" }}
                >
                  {item.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Harga: <strong>Rp{item.harga}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    marginBottom: 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  Deskripsi :{" "}
                  {item.deskripsi
                    ? item.deskripsi.split(" ").slice(0, 5).join(" ") +
                      (item.deskripsi.split(" ").length > 5 ? "..." : "")
                    : "Deskripsi tidak tersedia"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "start" }}>
                  <Link href={`/master/item/${item.idBarang}`} passHref>
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
                      handleDelete(item.idBarang);
                    }}
                  >
                    Hapus
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ItemPage;
