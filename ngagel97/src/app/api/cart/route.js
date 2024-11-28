import dbConnect from "@/app/api/mongoose";
import Cart from "@/models/Cart";

export default async function handler(req, res) {
  const { email, productId, add_on, cart_qty, cart_notes } = req.body;

  await dbConnect();

  try {
    if (req.method === "POST") {
      // Tambahkan produk ke cart
      let cart = await Cart.findOne({ email });
      if (!cart) {
        const newCart = new Cart({
          email,
          items: [{ product: productId, add_on, cart_qty, cart_notes }],
        });
        await newCart.save();
        return res
          .status(201)
          .json({ message: "Product added to cart", cart: newCart });
      }

      cart.items.push({ product: productId, add_on, cart_qty, cart_notes });
      await cart.save();
      return res.status(200).json({ message: "Product added to cart", cart });
    }

    if (req.method === "PUT") {
      // Update produk dalam cart
      const { itemId, cart_qty, cart_notes } = req.body; // `itemId` adalah ID item dalam array items

      const cart = await Cart.findOne({ email });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex === -1)
        return res.status(404).json({ message: "Item not found" });

      // Update item di cart
      if (cart_qty) cart.items[itemIndex].cart_qty = cart_qty;
      if (cart_notes) cart.items[itemIndex].cart_notes = cart_notes;

      await cart.save();
      return res
        .status(200)
        .json({ message: "Cart updated successfully", cart });
    }

    if (req.method === "DELETE") {
      // Hapus produk dari cart
      const { itemId } = req.body; // `itemId` adalah ID item dalam array items

      const cart = await Cart.findOne({ email });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      await cart.save();

      return res.status(200).json({ message: "Item removed from cart", cart });
    }

    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
