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
  Checkbox,
  FormControlLabel
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist"; // Import pdfjs-dist

const ProductDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [addOnList, setAddOnList] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]);
  // Set workerSrc for pdfjs
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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

      try {
        const res = await fetch("/api/addon");
        if (!res.ok) throw new Error("Failed to fetch add-ons");
        const data = await res.json();
        console.log("Fetched Add-ons:", data); // Debug log
        setAddOnList(data);
      } catch (err) {
        setError("Error fetching add-ons: " + err.message);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (service && service.addOns) {
      console.log("Service AddOns:", service.addOns); // Debug log
      const filteredAddOns = addOnList.filter((addon) =>
        service.addOns.includes(addon._id)
      );
      console.log("Filtered AddOns:", filteredAddOns); // Debug log
      setFilteredAddOnList(filteredAddOns);
    }
  }, [service, addOnList]); // Dependency array updated

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);

      // Load PDF to detect page count
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPageCount(pdf.numPages);
        } catch (err) {
          setError("Failed to read the PDF file.");
          console.error(err);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: service.id,
      name: service.nama,
      price: service.harga,
      quantity,
      file: uploadedFile,
      pages: pageCount,
      addons: addonQuantities
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
            <TextField type="file" accept="application/pdf" onChange={handleFileUpload} />
            {uploadedFile && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Selected File: {uploadedFile.name} <br />
                {pageCount !== null && `Pages: ${pageCount}`}
              </Typography>
            )}
          </Box>

          {/* Add-ons Selection */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add-ons:
            </Typography>
            {filteredAddOnList.map((addon) => (
              <Box key={addon._id} sx={{ marginBottom: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      
                    />
                  }
                  label={addon.nama}
                />
              </Box>
            ))}
          </Box>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={!service || !uploadedFile || !pageCount}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
