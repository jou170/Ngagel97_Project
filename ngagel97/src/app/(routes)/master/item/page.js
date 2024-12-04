"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Link from "next/link";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/barang");
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ marginBottom: 4, color: "#333" }}
      >
        Koleksi Barang
      </Typography>
      <Grid2 container spacing={3} justifyContent="center" alignItems="stretch">
        {items.map((item) => (
          <Grid2 key={item.idBarang} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: "100%", width: "500px", cursor: "pointer" }}>
              {item.gambar && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.gambar}
                  alt={item.nama || "Gambar Barang"}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent sx={{ padding: "16px" }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {item.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Harga: Rp{item.harga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.deskripsi}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginTop: "auto",
                  }}
                >
                  <Link href={`/master/item/${item.idBarang}`} passHref>
                    <Button variant="contained" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.idBarang);
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

export default ItemPage;
