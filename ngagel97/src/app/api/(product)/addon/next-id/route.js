import AddOn from "@/models/AddOn"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const lastAddOn = await AddOn.findOne().sort({ idAddon: -1 });
    const nextId = lastAddOn ? lastAddOn.idAddon + 1 : 1; // Jika belum ada AddOn, ID mulai dari 1
    return new Response(JSON.stringify({ id_addon: nextId }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gagal mendapatkan ID Add-On" }),
      { status: 500 }
    );
  }
}
