import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const JasaSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // Auto-increment ID
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga per satuan (misal per lembar untuk print)
    deskripsi: { type: String }, // Opsional, untuk informasi tambahan
    gambar: { type: String }, // Link ke gambar
    addOns: [{ type: Number }], // Referensi ke AddOn
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true }
);

JasaSchema.plugin(AutoIncrement(mongoose), { inc_field: "id" });

const Jasa = mongoose.models.Jasa || mongoose.model("Jasa", JasaSchema);
export default Jasa;
