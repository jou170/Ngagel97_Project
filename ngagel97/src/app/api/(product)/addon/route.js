import AddOn from "@/models/AddOn"; // Sesuaikan dengan lokasi model Anda
import dbConnect from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

export async function POST(request) {
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    const { nama, harga, tipeHarga, deskripsi, gambar } = await request.json();

    // Membuat AddOn baru
    const newAddOn = new AddOn({
      nama,
      harga,
      tipeHarga,
      deskripsi,
      gambar,
    });

    // Simpan ke database
    await newAddOn.save();

    return new Response(
      JSON.stringify({
        message: "AddOn created successfully",
        addOn: newAddOn,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create AddOn" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET({ params }) {
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    // Jika params.id ada, ambil AddOn berdasarkan id
    if (params && params.id) {
      const addOn = await AddOn.findOne({ _id: params.id, deleted: false });
      if (!addOn) {
        return new Response(JSON.stringify({ message: "AddOn not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(addOn), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika tidak ada params.id, ambil semua AddOns
    const addOns = await AddOn.find({ deleted: false });
    return new Response(JSON.stringify(addOns), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch AddOns" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT({ params, request }) {
  const { id } = params;
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    const updatedData = await request.json();

    const updatedAddOn = await AddOn.findOneAndUpdate(
      { id, deleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedAddOn) {
      return new Response(JSON.stringify({ message: "AddOn not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "AddOn updated", addOn: updatedAddOn }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update AddOn" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({ params }) {
  const { id } = params;
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    const deletedAddOn = await AddOn.findOneAndUpdate(
      { id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!deletedAddOn) {
      return new Response(JSON.stringify({ message: "AddOn not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "AddOn deleted", addOn: deletedAddOn }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete AddOn" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
