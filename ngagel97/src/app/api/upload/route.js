import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads"); // Menggunakan process.cwd() untuk path relatif dari root proyek

export const POST = async (req) => {
  // Mengambil query string 'filepath' dari URL
  const { searchParams } = new URL(req.url);
  const filePathFromQuery = searchParams.get("filepath"); // Ambil 'filepath' dari query string

  // Tentukan path upload berdasarkan query string, jika tidak ada gunakan default 'uploads'
  const uploadPath = filePathFromQuery
    ? path.join(UPLOAD_DIR, filePathFromQuery)
    : UPLOAD_DIR;

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = body.file || null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Jika folder sudah ada, hapus terlebih dahulu
    if (!fs.existsSync(uploadPath)) {
      fs.rmSync(uploadPath, { recursive: true, force: true });
    }
    // Pastikan direktori upload ada
    fs.mkdirSync(uploadPath, { recursive: true });

    // Menyimpan file dengan nama yang diberikan dalam form data
    const filePath = path.resolve(uploadPath, file.name);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      name: file.name,
      filePath: filePath
        .replace(process.cwd(), "")
        .replaceAll("\\", "/")
        .replace("/public", ""), // Ganti \ jadi / lalu hapus "/public" dari URL// Mengembalikan path relatif dari root proyek
    });
  } else {
    return NextResponse.json({
      success: false,
      message: "No file uploaded",
    });
  }
};
