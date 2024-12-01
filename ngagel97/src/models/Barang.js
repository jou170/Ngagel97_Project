import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const BarangSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga per unit (misal per lembar untuk fotokopi) atau harga 1 buku tulis, dll
    deskripsi: { type: String }, // Opsional, untuk informasi tambahan
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true, _id: false }
);

BarangSchema.plugin(AutoIncrement(mongoose), { inc_field: "id" });

const Barang = mongoose.models.Barang || mongoose.model("Barang", BarangSchema);
export default Barang;
