import Jasa from "@/models/Jasa";
import connectDB from "@/app/api/mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const lastJasa = await Jasa.findOne().sort({ idJasa: -1 });
    const nextId = lastJasa ? lastJasa.idJasa + 1 : 1;
    return new Response(JSON.stringify({ id_jasa: nextId }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gagal mendapatkan ID Add-On" }),
      { status: 500 }
    );
  }
}
