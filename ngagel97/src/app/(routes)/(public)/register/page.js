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
      "string.base": `"Name" should be a type of 'text'`,
      "string.empty": `"Name" cannot be empty`,
      "string.min": `"Name" should have a minimum length of {#limit}`,
    }),
    email: Joi.string()
      .pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
      .required()
      .messages({
        "string.base": `"Email" should be a type of 'text'`,
        "string.pattern.base": `"Email" must be a valid email`,
        "string.empty": `"Email" cannot be empty`,
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
      .required()
      .messages({
        "string.base": `"Password" should be a type of 'text'`,
        "string.pattern.base": `"Password" must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, and one number.`,
        "string.empty": `"Password" cannot be empty`,
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": `"Confirm Password" must match "password"`,
        "string.empty": `"Confirm Password" cannot be empty`,
      }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": `"Phone Number" should be a type of 'text'`,
        "string.pattern.base": `"Phone Number" should be a valid phone number`,
        "string.empty": `"Phone Number" cannot be empty`,
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
        // console.log(responseData); // Debugging response
        router.push("/login"); // Redirect after successful registration
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred while registering. Please try again.");
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
            Register
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
              Name:
            </Typography>
            <TextField
              label="Enter your name"
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
              label="Enter your email"
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
              label="Enter your password"
              variant="outlined"
              fullWidth
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Confirm Password:
            </Typography>
            <TextField
              label="Confirm your password"
              variant="outlined"
              fullWidth
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Typography variant="body1" sx={{ color: "black" }}>
              Phone Number:
            </Typography>
            <TextField
              label="Enter your phone number"
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="success"
              sx={{ marginTop: 2, borderRadius: 3, backgroundColor: "#493628" }}
            >
              Register
            </Button>
            <Typography variant="body2" marginTop={1} sx={{ color: "black" }}>
              Already have an account?{" "}
              <Link href="/login" underline="hover" sx={{ color: "black" }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
