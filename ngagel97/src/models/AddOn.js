import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const AddOnSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // Auto-increment ID
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga per layanan tambahan
    deskripsi: { type: String }, // Opsional
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true }
);

AddOnSchema.plugin(AutoIncrement(mongoose), { inc_field: "id" });

const AddOn = mongoose.models.AddOn || mongoose.model("AddOn", AddOnSchema);
export default AddOn;
