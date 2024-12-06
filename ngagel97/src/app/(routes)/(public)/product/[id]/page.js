"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CardMedia, CircularProgress, Alert } from "@mui/material";

const ProductDetail = ({ params }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/jasa/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch service details");
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container sx={{ marginTop: 4 }}>
        <Alert severity="warning">Service not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
        <CardMedia
          component="img"
          image={service.gambar}
          alt={service.nama}
          sx={{ borderRadius: 1, maxHeight: 400, objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {service.nama}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {service.deskripsi}
          </Typography>
          <Typography variant="h6" component="p">
            <strong>Price:</strong> ${service.harga}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
