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

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/jasa");
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data jasa:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus jasa ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/jasa/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data jasa.");
      }

      setServices((prevServices) =>
        prevServices.filter((service) => service.idJasa !== id)
      );
    } catch (error) {
      console.error("Gagal menghapus jasa:", error);
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
        Koleksi Jasa
      </Typography>
      <Grid2 container spacing={3} justifyContent="center" alignItems="stretch">
        {services.map((service) => (
          <Grid2 key={service.idJasa} xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", cursor: "pointer" }}>
              {service.gambar && (
                <CardMedia
                  component="img"
                  height="300"
                  image={service.gambar}
                  alt={service.nama || "Gambar Jasa"}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {service.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Harga: Rp{service.harga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kategori: {service.kategori}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.deskripsi}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <Link href={`/master/service/${service.idJasa}`} passHref>
                    <Button variant="contained" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(service.idJasa);
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

export default ServicesPage;
