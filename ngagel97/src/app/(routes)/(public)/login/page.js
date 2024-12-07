"use client";

import { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter(); // Hook untuk navigasi
  const emailRef = useRef(null); // Ref untuk email
  const passwordRef = useRef(null); // Ref untuk password
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload halaman
    setError(""); // Reset error sebelum mencoba login

    try {
      const email = emailRef.current.value; // Ambil nilai dari emailRef
      const password = passwordRef.current.value; // Ambil nilai dari passwordRef

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Kirim data sebagai body
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/home");
      } else {
        setError(data.message || "Gagal melakukan login. Silahkan coba lagi.");
      }
    } catch (error) {
      setError("Gagal melakukan login. Silahkan coba lagi.");
    }
  };

  return (
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
            label="Masukkan email"
            variant="outlined"
            name="email"
            fullWidth
            required
            inputRef={emailRef} // Assign ref
          />

          <Typography variant="h6" sx={{ color: "black" }}>
            Password:
          </Typography>
          <TextField
            label="Masukkan password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            inputRef={passwordRef} // Assign ref
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
              {error}
            </Typography>
          )}

          <Typography variant="body2" marginTop={1} sx={{ color: "black" }}>
            {"Tidak punya akun? "}
            <Link href="/register" underline="hover" sx={{ color: "black" }}>
              Registrasi di sini.
            </Link>
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              marginBottom: 2,
              borderRadius: 3,
              backgroundColor: "#493628",
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
