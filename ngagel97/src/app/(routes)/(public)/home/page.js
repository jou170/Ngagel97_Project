import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import Image from "next/image";

const HomePage = () => {
  const services = [
    { id: 1, name: "Printer A4", image: "/path/to/image1.jpg" },
    { id: 2, name: "Printer A3", image: "/path/to/image2.jpg" },
    { id: 3, name: "Fotocopy A3", image: "/path/to/image3.jpg" },
    { id: 4, name: "Jilid", image: "/path/to/image4.jpg" },
    { id: 5, name: "Printer A4", image: "/path/to/image5.jpg" },
    { id: 6, name: "Printer A3", image: "/path/to/image6.jpg" },
    { id: 7, name: "Fotocopy A3", image: "/path/to/image7.jpg" },
    { id: 8, name: "Jilid", image: "/path/to/image8.jpg" },
  ];

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
            <Card>
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
