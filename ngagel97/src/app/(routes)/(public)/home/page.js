"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import Image from "next/image";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/jasa");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCardClick = (idjasa) => {
    router.push(`/product/${idjasa}`);
  };

  return (
    <Box p={4}>
      {/* Banner Section */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          background: "linear-gradient(90deg, #3f51b5, #1a237e)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Explore Our High-Quality Services
        </Typography>
      </Box>

      {/* Icons Section */}
      <Grid2 container spacing={2} justifyContent="center" mb={4}>
        <Grid2 xs={6} sm={3}>
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
        </Grid2>
        <Grid2 xs={6} sm={3}>
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
        </Grid2>
        <Grid2 xs={6} sm={3}>
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
        </Grid2>
        <Grid2 xs={6} sm={3}>
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
        </Grid2>
      </Grid2>

      {/* Services Section */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Our Services
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={2}>
          {services.map((service) => (
            <Grid2 xs={12} sm={6} md={3} key={service._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleCardClick(service.idJasa)}
              >
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
                  <Typography variant="body1" textAlign="center" fontWeight="bold">
                    {service.nama}
                  </Typography>
                  <Typography variant="body2" textAlign="center" color="textSecondary">
                    {service.description || "No description available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default HomePage;
