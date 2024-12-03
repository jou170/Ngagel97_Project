"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";
import AddonCheckboxes from "../components/AddonCheckboxes";

export default function JasaForm() {
  const [error, setError] = useState(""); // state untuk menyimpan error global
  const router = useRouter(); // Inisialisasi router untuk navigasi
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]); // State untuk menyimpan add-ons yang dipilih

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

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
    deskripsi: Joi.string().optional().messages({
      "string.base": `"Deskripsi" should be a type of 'text'`,
    }),
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async (file, id_jasa) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/upload?filepath=jasa/${id_jasa}`, {
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
        const response = await fetch("/api/jasa/next-id", {
          method: "GET",
        });
        const { id_jasa } = await response.json();

        // Upload gambar dengan id_jasa
        filePath = await uploadImage(selectedFile, id_jasa);
        if (!filePath) throw new Error("Upload gambar gagal");
      }

      // Step 2: Simpan Jasa dengan file path (jika ada) dan selectedAddons
      const res = await fetch("/api/jasa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          gambar: filePath,
          addOns: selectedAddons, // Pass selectedAddons here
        }),
      });

      if (res.ok) {
        const responseData = await res.json();
        alert("Jasa berhasil disimpan!");
        // router.push("/service"); // Redirect ke halaman jasa setelah berhasil
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Jasa submission failed");
      }
    } catch (error) {
      setError(
        "An error occurred while submitting the jasa. Please try again."
      );
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
        <Typography variant="h4" gutterBottom>
          Add Jasa
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
            label="Enter jasa name"
            variant="outlined"
            fullWidth
            {...register("nama")}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          <Typography variant="body1">Harga</Typography>
          <TextField
            label="Enter jasa price"
            variant="outlined"
            fullWidth
            type="number"
            {...register("harga")}
            error={!!errors.harga}
            helperText={errors.harga?.message}
          />

          <Typography variant="body1">Deskripsi</Typography>
          <TextField
            label="Enter jasa description"
            variant="outlined"
            fullWidth
            {...register("deskripsi")}
            error={!!errors.deskripsi}
            helperText={errors.deskripsi?.message}
          />

          <Typography variant="body1">Upload Gambar:</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <AddonCheckboxes
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
          />

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
}