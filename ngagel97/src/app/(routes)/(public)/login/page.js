"use client";

import { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Container,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";

// Custom Styled Card
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

export default function LoginPage() {
  const router = useRouter(); // Hook untuk navigasi
  const emailRef = useRef(null); // Ref untuk email
  const passwordRef = useRef(null); // Ref untuk password
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State untuk remember me

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }), // Kirim nilai rememberMe ke API
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
    <Container
      maxWidth="sm"
      sx={{ display: "flex", justifyContent: "center", minHeight: "90vh" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              fontWeight: 700,
            }}
          >
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Email"
              id="outlined-required"
              fullWidth
              required
              inputRef={emailRef}
            />
            <TextField
              label="Password"
              type="password"
              id="outlined-required"
              fullWidth
              required
              inputRef={passwordRef}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember Me"
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#493628",
                color: "#fff",
                "&:hover": { backgroundColor: "#5a4632" },
              }}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              {"Don't have an account?  "}
              <Link
                href="/register"
                sx={{ color: "inherit" }}
                underline="hover"
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
