import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [
    {
      product: {
        product_id: String,
        product_name: String,
        product_price: Number,
        product_description: String,
        category: {
          category_id: String,
          category_name: String,
        },
      },
      add_on: {
        add_on_id: String,
        add_on_name: String,
        add_on_price: Number,
        add_on_description: String,
      },
      cart_qty: { type: Number, required: true },
      cart_notes: String,
      cart_document: String,
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

module.exports = Cart;
