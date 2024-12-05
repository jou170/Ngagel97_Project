"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
} from "@mui/material";
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
        console.error("Gagal mengambil data barang:", error);
        setLoading(false);
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
      console.error("Gagal menghapus barang:", error);
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
    <Box sx={{ padding: "20px", backgroundColor: "#D6C0B3", minHeight: "100vh" }}>
      {/* Header dengan judul dan search bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#333", fontWeight: "bold" }}
        >
          Koleksi Barang
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Search:
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Ketik nama barang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              width: "250px",
            }}
          />
        </Box>
      </Box>

      {/* Daftar Barang */}
      <Grid2 container spacing={4} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid2 key={item.idBarang} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              {/* {item.gambar && (
                <CardMedia
                  component="img"
                  height="300"
                  image={item.gambar}
                  alt={item.nama || "Gambar Barang"}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
              )} */}
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
                  {item.deskripsi}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Link href={`/master/item/${item.idBarang}`} passHref>
                    <Button variant="contained" color="primary" size="small">
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
