import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";

export async function PUT(request, { params }) {
  const { id } = await params; // Ambil ID dari URL

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    // Data yang akan diupdate
    const { status } = await request.json();

    // Update data transaksi berdasarkan ID
    const updatedTransaksi = await Transaksi.findByIdAndUpdate(
      id, // ID dari params
      { status: status }, // Data yang dikirim dari client
      { new: true } // Mengembalikan data terbaru
    );

    if (!updatedTransaksi) {
      return new Response(
        JSON.stringify({ message: "Transaction not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Transaction updated successfully",
        data: updatedTransaksi,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to update transaction" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
