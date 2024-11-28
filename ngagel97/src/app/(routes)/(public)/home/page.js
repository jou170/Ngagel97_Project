import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const HomePage = () => {
  const services = [
    { id: 1, name: "Printer A4", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Printer A3", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Fotocopy A3", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Jilid", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Printer A4", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Printer A3", image: "https://via.placeholder.com/150" },
    { id: 7, name: "Fotocopy A3", image: "https://via.placeholder.com/150" },
    { id: 8, name: "Jilid", image: "https://via.placeholder.com/150" },
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
            <img
              src="https://via.placeholder.com/80"
              alt="High Digital Printing"
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">High Digital Printing</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <img
              src="https://via.placeholder.com/80"
              alt="Great Quality"
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Great Quality</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <img
              src="https://via.placeholder.com/80"
              alt="Handled With Care"
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Handled With Care</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <img
              src="https://via.placeholder.com/80"
              alt="Fast Delivery"
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
              <CardMedia
                component="img"
                height="140"
                image={service.image}
                alt={service.name}
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
