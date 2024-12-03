import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const JasaSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga per satuan (misal per lembar untuk print)
    deskripsi: { type: String }, // Opsional, untuk informasi tambahan
    gambar: { type: String }, // Link ke gambar
    addOns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddOn", // Referensi ke model AddOn
        required: true,
      },
    ],
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true, _id: false }
);

JasaSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "id",
  id: "id_jasa",
});

const Jasa = mongoose.models.Jasa || mongoose.model("Jasa", JasaSchema);
export default Jasa;
