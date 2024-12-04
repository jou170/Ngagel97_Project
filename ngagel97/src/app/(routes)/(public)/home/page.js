"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter(); // Initialize router from next/navigation

  const services = [
    { id: "P001", name: "Printer A4", image: "/path/to/image1.jpg" },
    { id: "P002", name: "Printer A3", image: "/path/to/image2.jpg" },
    { id: "P003", name: "Fotocopy A3", image: "/path/to/image3.jpg" },
    { id: "P004", name: "Jilid", image: "/path/to/image4.jpg" },
    { id: "P005", name: "Printer A4", image: "/path/to/image5.jpg" },
    { id: "P006", name: "Printer A3", image: "/path/to/image6.jpg" },
    { id: "P007", name: "Fotocopy A3", image: "/path/to/image7.jpg" },
    { id: "P008", name: "Jilid", image: "/path/to/image8.jpg" },
  ];

  const handleCardClick = (id) => {
    router.push(`/product/${id}`); // Navigate to the product page with the dynamic ID
  };

  return (
    <Box p={4}>
      {/* Banner Section */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Foto Copy Hitam Putih
        </Typography>
      </Box>

      {/* Icons Section */}
      <Grid container spacing={2} justifyContent="center" mb={4}>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Image
              src="/path/to/icon1.png"
              alt="High Digital Printing"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">High Digital Printing</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Image
              src="/path/to/icon2.png"
              alt="Great Quality"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Great Quality</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Image
              src="/path/to/icon3.png"
              alt="Handled With Care"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Handled With Care</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Image
              src="/path/to/icon4.png"
              alt="Fast Delivery"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Fast Delivery</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Services Section */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Our Service
      </Typography>
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={6} sm={3} key={service.id}>
            <Card
              sx={{ cursor: "pointer" }} // Add cursor pointer to indicate clickable
              onClick={() => handleCardClick(service.id)} // Handle click event
            >
              <Image
                src={service.image}
                alt={service.name}
                width={300}
                height={140}
                style={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="body1" textAlign="center">
                  {service.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
