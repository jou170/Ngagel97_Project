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
import Image from "next/image";
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
      {/* Login Form */}
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop={5}
        >
          <Image
            src="/image/HumanLogoLogin.png"
            alt="Logo"
            width={150}
            height={150}
            style={{ marginBottom: "20px" }}
          />
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>

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
              Don&apos;t have an account?{" "}
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
