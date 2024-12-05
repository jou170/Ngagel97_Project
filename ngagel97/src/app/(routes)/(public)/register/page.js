"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Joi from "joi";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  // Use react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.base": `"Nama" harus berupa teks`,
      "string.empty": `"Nama" wajib diisi`,
      "string.min": `"Nama" minimal {#limit} karakter`,
    }),
    email: Joi.string()
      .pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
      .required()
      .messages({
        "string.base": `"Email" harus berupa teks`,
        "string.pattern.base": `"Email" harus valid`,
        "string.empty": `"Email" wajib diisi`,
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
      .required()
      .messages({
        "string.base": `"Password" harus berupa teks`,
        "string.pattern.base": `"Password" minimal 8 karakter, mengandung setidaknya 1 huruf kecil, 1 huruf besar, dan 1 angka.`,
        "string.empty": `"Password" wajib diisi`,
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": `"Konfirmasi Password" harus sama dengan "Password"`,
        "string.empty": `"Konfirmasi Password" wajib diisi`,
      }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": `"Nomor Telepon" harus berupa teks`,
        "string.pattern.base": `"Nomor Telepon" harus valid`,
        "string.empty": `"Nomor Telepon" wajib diisi`,
      }),
  });

  const onSubmit = async (data) => {
    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      validation.error.details.forEach((err) => {
        setFormError(err.context.key, { message: err.message });
      });
      return;
    }

    setError(""); // Clear error if any

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const responseData = await res.json();
        router.push("/login"); // Redirect after successful registration
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "Gagal melakukan registrasi. Silahkan coba lagi."
        );
      }
    } catch (error) {
      setError("Gagal melakukan registrasi. Silahkan coba lagi.");
    }
  };

  return (
    <>
      {/* Registration Form */}
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
            Registrasi
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={2}
            width="100%"
          >
            <Typography variant="body1" sx={{ color: "black" }}>
              Nama:
            </Typography>
            <TextField
              label="Masukkan nama"
              variant="outlined"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Email:
            </Typography>
            <TextField
              label="Masukkan email"
              variant="outlined"
              fullWidth
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Password:
            </Typography>
            <TextField
              label="Masukkan password"
              variant="outlined"
              fullWidth
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Konfirmasi Password:
            </Typography>
            <TextField
              label="Masukkan ulang password"
              variant="outlined"
              fullWidth
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Nomor Telepon:
            </Typography>
            <TextField
              label="Masukkan nomor telepon"
              variant="outlined"
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Typography variant="body2" marginTop={1} sx={{ color: "black" }}>
              {"Sudah punya akun? "}
              <Link href="/login" underline="hover" sx={{ color: "black" }}>
                Login di sini.
              </Link>
            </Typography>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="success"
              sx={{
                marginBottom: 2,
                borderRadius: 3,
                backgroundColor: "#493628",
              }}
            >
              Registrasi
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
