import Jasa from "@/models/Jasa"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

// Fungsi GET (gabungan)
export async function GET({ params }) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    if (params && params.id) {
      // Jika ada parameter 'id', cari Jasa berdasarkan id
      const jasa = await Jasa.findOne({ id: params.id, deleted: false });
      if (!jasa) {
        return new Response(JSON.stringify({ message: "Jasa not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(jasa), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Jika tidak ada 'id', ambil semua Jasa yang belum dihapus
      const jasas = await Jasa.find({ deleted: false });

      return new Response(JSON.stringify(jasas), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Fungsi POST untuk membuat Jasa baru
export async function POST(request) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const { nama, harga, deskripsi, gambar, addOns } = await request.json();

    // Membuat Jasa baru
    const newJasa = new Jasa({
      nama,
      harga,
      deskripsi,
      gambar,
      addOns, // Referensi ke AddOn
    });

    // Simpan ke database
    await newJasa.save();

    return new Response(
      JSON.stringify({ message: "Jasa created successfully", jasa: newJasa }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Fungsi PUT untuk update data Jasa
export async function PUT({ params, request }) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const { id } = params;
    const { nama, harga, deskripsi, gambar, addOn } = await request.json();

    // Cari jasa berdasarkan ID
    const jasa = await Jasa.findOne({ id, deleted: false });
    if (!jasa) {
      return new Response(JSON.stringify({ message: "Jasa not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update jasa dengan data baru
    jasa.nama = nama || jasa.nama;
    jasa.harga = harga || jasa.harga;
    jasa.deskripsi = deskripsi || jasa.deskripsi;
    jasa.gambar = gambar || jasa.gambar;
    jasa.addOns = addOn || jasa.addOns;

    // Simpan perubahan
    await jasa.save();

    return new Response(
      JSON.stringify({ message: "Jasa updated successfully", jasa }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Fungsi DELETE untuk soft delete Jasa
export async function DELETE({ params }) {
  const { id } = params;
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const jasa = await Jasa.findOneAndUpdate(
      { id, deleted: false },
      { deleted: true }, // Set deleted menjadi true
      { new: true } // Mendapatkan data terbaru setelah pembaruan
    );

    if (!jasa) {
      return new Response(JSON.stringify({ message: "Jasa not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Jasa deleted successfully", jasa }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
