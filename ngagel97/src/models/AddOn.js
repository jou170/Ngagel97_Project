import mongoose from "mongoose";

const addOnSchema = new mongoose.Schema({
  add_on_id: { type: String, required: true, unique: true },
  add_on_name: { type: String, required: true },
  add_on_price: { type: Number, required: true },
  add_on_description: String,
});

const AddOn = mongoose.models.AddOn || mongoose.model("AddOn", addOnSchema);

module.exports = AddOn;
