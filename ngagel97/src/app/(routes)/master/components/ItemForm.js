"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  TextareaAutosize as BaseTextareaAutosize,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 5px;
    color: ${theme.palette.mode === "dark" ? "#C7D0DD" : "#1C2025"};
    background: ${theme.palette.mode === "dark" ? "#1C2025" : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? "#434D5B" : "#DAE2ED"};
    box-shadow: 0 2px 2px ${
      theme.palette.mode === "dark" ? "#1C2025" : "#F3F6F9"
    };

    &:hover {
      border-color: #3399FF;
    }

    &:focus {
      border-color: #3399FF;
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? "#0072E5" : "#b6daff"
      };
    }

    &:focus-visible {
      outline: 0;
    }
  `
);

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
      "number.empty": `"Harga" tidak boleh kosong`,
    }),
    deskripsi: Joi.string().required().messages({
      "string.base": `"Deskripsi" harus berupa teks`,
      "string.empty": `"Deskripsi" tidak boleh kosong`,
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

  if (error) return <Alert severity="error">{error}</Alert>;
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={5}
      >
        <Box
          bgcolor="white"
          padding={4}
          borderRadius={2}
          boxShadow={3}
          width="100%"
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
            <Typography variant="body1">Nama</Typography>
            <TextField
              label="Masukkan Nama Barang "
              variant="outlined"
              fullWidth
              value={watch("nama") || ""}
              {...register("nama")}
              error={!!errors.nama}
              helperText={errors.nama?.message}
            />

            <Typography variant="body1">Harga</Typography>
            <TextField
              label="Masukkan Harga Barang"
              variant="outlined"
              fullWidth
              type="number"
              value={watch("harga") || ""}
              {...register("harga")}
              error={!!errors.harga}
              helperText={errors.harga?.message}
            />

            <Typography variant="body1">Deskripsi</Typography>
            <Textarea
              minRows={4}
              placeholder="Masukkan Deskripsi Barang"
              value={watch("deskripsi") || ""}
              {...register("deskripsi")}
              style={{ borderColor: errors.deskripsi ? "red" : undefined }}
            />
            {errors.deskripsi && (
              <Typography color="error">{errors.deskripsi.message}</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="success"
              sx={{ marginTop: 2, borderRadius: 3, backgroundColor: "#493628" }}
            >
              {mode === "add" ? "Tambah Barang" : "Perbarui Barang"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
