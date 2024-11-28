"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter(); // Hook untuk navigasi
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update field yang sesuai
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload halaman
    setError(""); // Reset error sebelum mencoba login

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Kirim formData sebagai body
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Simpan token di localStorage
        router.push("/dashboard"); // Redirect ke halaman dashboard atau home
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <>
      {/* AppBar for Header */}
      <AppBar position="static" sx={{ backgroundColor: "#AB886D" }}>
        <Toolbar sx={{ justifyContent: "space-between", paddingX: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/image/Ngagel97Logo.png"
              alt="Fotocopy Vindi Logo"
              style={{
                width: "50px",
                height: "auto",
                marginRight: "10px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: "24px",
                fontFamily: "-moz-initial",
                color: "#FFFFFF",
              }}
            >
              Ngagel97
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Form */}
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop={5}
        >
          <img
            src="/image/HumanLogoLogin.png"
            alt="Login Logo"
            style={{ width: "150px", height: "auto", marginBottom: "20px" }}
          />

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={2}
            width="100%"
            onSubmit={handleSubmit}
          >
            <Typography variant="h6" sx={{ color: "black" }}>
              Email:
            </Typography>
            <TextField
              label="Enter your email"
              variant="outlined"
              name="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <Typography variant="h6" sx={{ color: "black" }}>
              Password:
            </Typography>
            <TextField
              label="Enter your password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={formData.password}
              onChange={handleInputChange}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                {error}
              </Typography>
            )}

            <Typography variant="body2" marginTop={1} sx={{ color: "black" }}>
              Don't have an account?{" "}
              <Link href="/register" underline="hover" sx={{ color: "black" }}>
                Click here to register
              </Link>
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{
                marginTop: 2,
                borderRadius: 3,
                backgroundColor: "#493628",
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
