"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

// Custom Styled Card (reused from Register)
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
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function ProfilePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.base": `"Nama" harus berupa teks`,
      "string.empty": `"Nama" wajib diisi`,
      "string.min": `"Nama" minimal {#limit} karakter`,
    }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": `"Nomor Telepon" harus berupa teks`,
        "string.pattern.base": `"Nomor Telepon" harus valid`,
        "string.empty": `"Nomor Telepon" wajib diisi`,
      }),
    oldPassword: Joi.string().allow(""),
    newPassword: Joi.string()
      .allow("")
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
      .messages({
        "string.pattern.base": `"Password Baru" minimal 8 karakter, mengandung setidaknya 1 huruf kecil, 1 huruf besar, dan 1 angka.`,
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/user/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Gagal memperbarui profil.");
      }
    } catch (error) {
      setError("Gagal memperbarui profil. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}
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
            Update Profile
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Nama"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Nomor Telepon"
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            <TextField
              label="Password Lama"
              type="password"
              fullWidth
              {...register("oldPassword")}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
            />
            <TextField
              label="Password Baru"
              type="password"
              fullWidth
              {...register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
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
              disabled={loading}
              sx={{
                backgroundColor: "#493628",
                color: "#fff",
                "&:hover": { backgroundColor: "#5a4632" },
              }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
