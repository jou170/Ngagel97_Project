"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";

export default function ItemForm({ mode = "add", id }) {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
    setValue,
  } = useForm();

  const schema = Joi.object({
    nama: Joi.string().min(3).required().messages({
      "string.base": `"Nama" harus berupa teks`,
      "string.empty": `"Nama" tidak boleh kosong`,
      "string.min": `"Nama" minimal {#limit} karakter`,
    }),
    harga: Joi.number().min(100).positive().required().messages({
      "number.base": `"Harga" harus berupa angka`,
      "number.min": `"Harga" minimal Rp 100,-`,
      "number.positive": `"Harga" harus angka positif`,
    }),
    deskripsi: Joi.string().required().messages({
      "string.base": `"Deskripsi" should be a type of 'text'`,
    }),
  });

  const fetchBarangData = async (id) => {
    try {
      const res = await fetch(`/api/barang/${id}`);
      if (res.ok) {
        const data = await res.json();
        setValue("nama", data.nama);
        setValue("harga", data.harga);
        setValue("deskripsi", data.deskripsi);
      } else {
        throw new Error("Gagal mengambil data.");
      }
    } catch (error) {
      setError(error.message);
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

    setError("");

    try {
      const method = mode === "add" ? "POST" : "PUT";
      const endpoint = mode === "add" ? "/api/barang" : `/api/barang/${id}`;
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (res.ok) {
        alert(
          `Barang berhasil ${mode === "add" ? "ditambahkan" : "diperbarui"}!`
        );
        router.push("/master/item");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Barang submission failed");
      }
    } catch (error) {
      setError("Gagal menyimpan perubahan pada Add On. Silahkan coba lagi.");
    }
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchBarangData(id);
    }
  }, [mode, id]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={5}
      >
        <Typography variant="h4" gutterBottom>
          {mode === "add" ? "Tambah Barang" : "Edit Barang"}
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
            label="Enter Barang name"
            variant="outlined"
            fullWidth
            value={watch("nama") || ""}
            {...register("nama")}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          <Typography variant="body1">Harga</Typography>
          <TextField
            label="Enter Barang price"
            variant="outlined"
            fullWidth
            type="number"
            value={watch("harga") || ""}
            {...register("harga")}
            error={!!errors.harga}
            helperText={errors.harga?.message}
          />

          <Typography variant="body1">Deskripsi</Typography>
          <TextField
            label="Enter Barang description"
            variant="outlined"
            fullWidth
            value={watch("deskripsi") || ""}
            {...register("deskripsi")}
            error={!!errors.deskripsi}
            helperText={errors.deskripsi?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="success"
            sx={{ marginTop: 2, borderRadius: 3 }}
          >
            {mode === "add" ? "Tambah Barang" : "Perbarui Barang"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
