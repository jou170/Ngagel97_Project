"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Box,
} from "@mui/material";

const ProductDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/jasa/${id}`);
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
  }, [id]);

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: service.id,
      name: service.nama,
      price: service.harga,
      quantity,
      file: uploadedFile,
    };

    console.log("Added to cart:", cartItem);
    alert("Item added to cart!");
  };

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
          <Typography variant="h6" component="p" gutterBottom>
            <strong>Price:</strong> ${service.harga}
          </Typography>

          {/* Quantity Input */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              sx={{ width: "100px" }}
            />
          </Box>

          {/* File Upload */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1" gutterBottom>
              Upload File:
            </Typography>
            <TextField type="file" onChange={handleFileUpload} />
            {uploadedFile && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Selected File: {uploadedFile.name}
              </Typography>
            )}
          </Box>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={!service || (uploadedFile && uploadedFile.size > 5000000) || "File Too Large"} // Example size limit: 5MB
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
