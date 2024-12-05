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

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/jasa");
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data jasa:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = services.filter((service) =>
        service.nama.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredServices(filtered);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, services]);

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
            Koleksi Jasa
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.location.href = "/master/service/add";
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
              Add Service
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
                placeholder="Ketik nama jasa..."
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

      <Grid2 container spacing={3} justifyContent="center" alignItems="stretch">
        {filteredServices.map((service) => (
          <Grid2 key={service.idJasa} xs={12} sm={6} md={4}>
            <Card sx={{ width: 380, height: 400 }}>
              {service.gambar ? (
                <Image
                  src={service.gambar}
                  alt={service.nama || "Gambar Jasa"}
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
                  alt="Gambar Jasa"
                  width={380}
                  height={200}
                  style={{
                    objectFit: "cover",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {service.nama}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Harga: Rp{service.harga}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deskripsi :{" "}
                  {service.deskripsi
                    ? service.deskripsi.split(" ").slice(0, 5).join(" ") +
                      (service.deskripsi.split(" ").length > 5 ? "..." : "")
                    : "Deskripsi tidak tersedia"}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "16px",
                  }}
                >
                  <Link href={`/master/service/${service.idJasa}`} passHref>
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
