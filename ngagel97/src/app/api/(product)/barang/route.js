import Barang from "@/models/Barang"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

export async function POST(request) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const { nama, harga, deskripsi } = await request.json();

    // Membuat Barang baru
    const newBarang = new Barang({
      nama,
      harga,
      deskripsi,
    });

    // Simpan ke database
    await newBarang.save();

    return new Response(
      JSON.stringify({
        message: "Barang created successfully",
        barang: newBarang,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const barangs = await Barang.find({ deleted: false });

    return new Response(JSON.stringify(barangs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Barangs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET({ params }) {
  const { id } = params;
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const barang = await Barang.findOne({ id, deleted: false });
    if (!barang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(barang), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT({ params, request }) {
  const { id } = params;
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const updatedData = await request.json();

    const updatedBarang = await Barang.findOneAndUpdate(
      { id, deleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedBarang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Barang updated", barang: updatedBarang }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({ params }) {
  const { id } = params;
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const deletedBarang = await Barang.findOneAndUpdate(
      { id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!deletedBarang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Barang deleted", barang: deletedBarang }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
