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
  Alert,
  TextareaAutosize as BaseTextareaAutosize 
} from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";

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
    color: ${theme.palette.mode === 'dark' ? '#C7D0DD' : '#1C2025'};
    background: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434D5B' : '#DAE2ED'};
    box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'};

    &:hover {
      border-color: #3399FF;
    }

    &:focus {
      border-color: #3399FF;
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? '#0072E5' : '#b6daff'};
    }

    &:focus-visible {
      outline: 0;
    }
  `
);

export default function AddOnForm({ mode = "add", id }) {
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastImageUrl, setlastImageUrl] = useState(null);
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
      "string.empty": `"Nama" harus diisi`,
      "string.min": `"Nama" minimal {#limit} karakter`,
    }),
    harga: Joi.number().min(100).positive().required().messages({
      "number.base": `"Harga" harus berupa angka`,
      "number.min": `"Harga" minimal Rp 100,-`,
      "number.positive": `"Harga" harus angka positif`,
    }),
    tipeHarga: Joi.string().valid("bundle", "lembar").required().messages({
      "any.only": `"Tipe Harga" hanya bisa 'bundle' atau 'lembar'`,
      "string.empty": `"Tipe Harga" harus diisi`,
    }),
    deskripsi: Joi.string().required().messages({
      "string.base": `"Deskripsi" harus berupa teks`,
      "string.empty": `"Deskripsi" harus diisi`,
    }),
  });

  const fetchAddOnData = async (id) => {
    try {
      const res = await fetch(`/api/addon/${id}`);
      if (res.ok) {
        const data = await res.json();
        setValue("nama", data.nama);
        setValue("harga", data.harga);
        setValue("tipeHarga", data.tipeHarga);
        setValue("deskripsi", data.deskripsi);
        setlastImageUrl(data.gambar);
      } else {
        throw new Error("Gagal mengambil data.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const uploadImage = async (file, lastUrl) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    let filepath = lastUrl.replace(
      "https://mnyziu33qakbhpjn.public.blob.vercel-storage.com/",
      ""
    );
    await fetch(`/api/upload?filepath=${filepath}`, {
      method: "DELETE",
    });

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    } else {
      const data = await res.json();
      throw new Error(data.error || "Upload gagal");
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
    let imageUrl = lastImageUrl;

    try {
      if (selectedFile) {
        if (lastImageUrl) {
          imageUrl = await uploadImage(selectedFile, lastImageUrl);
        } else {
          imageUrl = await uploadImage(selectedFile, "");
        }
      }

      const method = mode === "add" ? "POST" : "PUT";
      const endpoint = mode === "add" ? "/api/addon" : `/api/addon/${id}`;
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, gambar: imageUrl }),
      });

      if (res.ok) {
        alert(
          `Add-On berhasil ${mode === "add" ? "ditambahkan" : "diperbarui"}!`
        );
        router.push("/master/addon");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Add-On submission failed");
      }
    } catch (error) {
      setError("Gagal menyimpan perubahan pada Add On. Silahkan coba lagi.");
    }
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchAddOnData(id);
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
        style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}
      >
        <Typography variant="h4" gutterBottom>
          {mode === "add" ? "Tambah Add-On" : "Edit Add-On"}
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
            label="Masukkan Nama Add-on"
            variant="outlined"
            fullWidth
            value={watch("nama") || ""}
            {...register("nama")}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          <Typography variant="body1">Harga</Typography>
          <TextField
            label="Masukkan Harga Add-on"
            variant="outlined"
            fullWidth
            type="number"
            value={watch("harga") || ""}
            {...register("harga")}
            error={!!errors.harga}
            helperText={errors.harga?.message}
          />

          <FormControl fullWidth error={!!errors.tipeHarga}>
            <InputLabel>Tipe Harga</InputLabel>
            <Select
              label="Tipe Harga"
              value={watch("tipeHarga") || ""}
              {...register("tipeHarga")}
            >
              <MenuItem value="bundle">Bundle</MenuItem>
              <MenuItem value="lembar">Lembar</MenuItem>
            </Select>
            {errors.tipeHarga && (
              <FormHelperText>{errors.tipeHarga.message}</FormHelperText>
            )}
          </FormControl>

          <Typography variant="body1">Deskripsi</Typography>
          <Textarea
            aria-label="Deskripsi Add-On"
            minRows={4}
            placeholder="Masukkan Deskripsi Add-on"
            {...register("deskripsi")}
          />
          {errors.deskripsi && (
            <FormHelperText error>{errors.deskripsi.message}</FormHelperText>
          )}

          <Typography variant="body1">Upload Gambar</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {error && <Typography color="error">{error}</Typography>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2, borderRadius: 3, backgroundColor: "#493628" }}
          >
            {mode === "add" ? "Tambah Add-On" : "Perbarui Add-On"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
