"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { useRouter } from "next/navigation";
import AddonCheckboxes from "./AddonCheckboxes";

export default function ServiceForm({ mode = "add", id }) {
  const [error, setError] = useState(""); // state untuk menyimpan error global
  const [lastImagePath, setLastImagePath] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]); // State untuk menyimpan add-ons yang dipilih
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
      "string.min": `"Nama" harus memiliki minimal {#limit} kata`,
    }),
    harga: Joi.number().min(100).positive().required().messages({
      "number.base": `"Harga" harus berupa angka`,
      "number.min": `"Harga" minimal Rp 100,-`,
      "number.positive": `"Harga" harus angka positive`,
      "number.empty": `"Harga" tidak boleh kosong`,
    }),
    deskripsi: Joi.string().required().messages({
      "string.base": `"Deskripsi" harus berupa teks'`,
    }),
  });

  const fetchServiceData = async (id) => {
    try {
      const res = await fetch(`/api/jasa/${id}`);
      if (res.ok) {
        const data = await res.json();
        setValue("nama", data.nama);
        setValue("harga", data.harga);
        setValue("deskripsi", data.deskripsi);
        setLastImagePath(data.gambar);
        setSelectedAddons(data.addOns);
      } else {
        throw new Error("Gagal mengambil data.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

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

    setError("");
    let filePath = lastImagePath;

    try {
      if (selectedFile) {
        const id_jasa = mode === "add" ? await fetchNextId() : id;
        filePath = await uploadImage(selectedFile, id_jasa);
      }

      const method = mode === "add" ? "POST" : "PUT";
      const endpoint = mode === "add" ? "/api/jasa" : `/api/jasa/${id}`;
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          addOns: selectedAddons,
          gambar: filePath,
        }),
      });
      if (res.ok) {
        alert(
          `Jasa berhasil ${mode === "add" ? "ditambahkan" : "diperbarui"}!`
        );
        router.push("/master/service");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Jasa submission failed");
      }
    } catch (error) {
      setError("Gagal menyimpan perubahan pada Jasa. Silahkan coba lagi.");
    }
  };

  const fetchNextId = async () => {
    const res = await fetch("/api/jasa/next-id");
    const { id_jasa } = await res.json();
    return id_jasa;
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchServiceData(id);
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
            label="masukkan nama jasa"
            variant="outlined"
            fullWidth
            value={watch("nama") || ""}
            {...register("nama")}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          <Typography variant="body1">Harga</Typography>
          <TextField
            label="masukkan harga jasa"
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
            label="masukkan deskripsi jasa"
            variant="outlined"
            fullWidth
            value={watch("deskripsi") || ""}
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
