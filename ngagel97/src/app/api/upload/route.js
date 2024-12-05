import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: "public" });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("filepath"); // Ambil 'filepath' dari query params

  if (!filePath) {
    return NextResponse.json(
      { error: "Filepath is required" },
      { status: 400 }
    );
  }

  try {
    await del(filePath); // Hapus file
    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
}
