"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";

export default function AddOnForm() {
  const [error, setError] = useState(""); // state untuk menyimpan error global
  const router = useRouter(); // Inisialisasi router untuk navigasi
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    setValue, // setValue untuk memperbarui nilai form
  } = useForm();

  // Schema validasi untuk form add-on
  const schema = Joi.object({
    nama: Joi.string().min(3).required().messages({
      "string.base": `"Nama" should be a type of 'text'`,
      "string.empty": `"Nama" cannot be empty`,
      "string.min": `"Nama" should have a minimum length of {#limit}`,
    }),
    harga: Joi.number().min(100).positive().required().messages({
      "number.base": `"Harga" should be a number`,
      "number.min": `"Harga" minimal Rp 100,-`,
      "number.positive": `"Harga" must be a positive number`,
      "number.empty": `"Harga" cannot be empty`,
    }),
    tipeHarga: Joi.string().valid("bundle", "lembar").required().messages({
      "any.only": `"Tipe Harga" should be either 'bundle' or 'lembar'`,
    }),
    deskripsi: Joi.string().optional().messages({
      "string.base": `"Deskripsi" should be a type of 'text'`,
    }),
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async (file, id_addon) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/upload?filepath=addon/${id_addon}`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.filePath;
    } else {
      const data = await res.json();
      throw new Error(data.error || "Failed to upload image");
    }
  };

  // Fungsi submit untuk menangani form submission
  const onSubmit = async (data) => {
    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      validation.error.details.forEach((err) => {
        setFormError(err.context.key, { message: err.message });
      });
      return;
    }

    setError(""); // Clear error jika validasi berhasil
    let filePath = null;

    try {
      // Step 1: Upload gambar jika ada
      if (selectedFile) {
        // Dapatkan id_addon terlebih dahulu
        const response = await fetch("/api/addon/next-id", {
          method: "GET",
        });
        const { id_addon } = await response.json();

        // Upload gambar dengan id_addon
        filePath = await uploadImage(selectedFile, id_addon);
        if (!filePath) throw new Error("Upload gambar gagal");
      }

      // Step 2: Simpan Add-On dengan file path (jika ada)
      const res = await fetch("/api/addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, gambar: filePath }),
      });

      if (res.ok) {
        const responseData = await res.json();
        alert("Add-On berhasil disimpan!");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Add-On submission failed");
      }
    } catch (error) {
      setError(
        "An error occurred while submitting the add-on. Please try again."
      );
    }
  };

  // Fungsi untuk menangani perubahan nilai tipeHarga
  const handleTipeHargaChange = (event) => {
    setValue("tipeHarga", event.target.value); // Memperbarui nilai form untuk tipeHarga
  };

  useEffect(() => {
    // Set nilai default untuk tipeHarga
    setValue("tipeHarga", ""); // Pastikan nilai default kosong atau salah satu dari opsi
  }, [setValue]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={5}
      >
        <Typography variant="h4" gutterBottom>
          Add Add-On
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
          <Typography variant="body1">Nama :</Typography>
          <TextField
            label="Enter add-on name"
            variant="outlined"
            fullWidth
            {...register("nama")}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          <Typography variant="body1">Harga</Typography>
          <TextField
            label="Enter add-on price"
            variant="outlined"
            fullWidth
            type="number"
            {...register("harga")}
            error={!!errors.harga}
            helperText={errors.harga?.message}
          />

          <FormControl fullWidth error={!!errors.tipeHarga}>
            <InputLabel>Tipe Harga</InputLabel>
            <Select
              label="Tipe Harga"
              defaultValue={""} // set default value jika tipeHarga tidak terisi
              onChange={handleTipeHargaChange} // Handle perubahan
              {...register("tipeHarga")} // Menghubungkan dengan react-hook-form
            >
              <MenuItem value="bundle">Bundle</MenuItem>
              <MenuItem value="lembar">Lembar</MenuItem>
            </Select>
            {errors.tipeHarga && (
              <FormHelperText>{errors.tipeHarga.message}</FormHelperText>
            )}
          </FormControl>

          <Typography variant="body1">Deskripsi</Typography>
          <TextField
            label="Enter add-on description"
            variant="outlined"
            fullWidth
            {...register("deskripsi")}
            error={!!errors.deskripsi}
            helperText={errors.deskripsi?.message}
          />

          <Typography variant="body1">Upload Gambar:</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
            Submit Add-On
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
