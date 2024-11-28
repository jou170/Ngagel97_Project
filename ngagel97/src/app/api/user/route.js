import dbConnect from "@/app/api/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect(); // Hubungkan ke database

  const {
    method,
    query: { id },
  } = req; // `id` untuk update dan soft delete

  try {
    switch (method) {
      case "PUT": // Change User Role
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { role },
          { new: true }
        );
        if (!updatedUser)
          return res.status(404).json({ message: "User not found" });
        return res
          .status(200)
          .json({ message: "Role updated", user: updatedUser });

      case "DELETE": // Soft Delete User
        const softDeletedUser = await User.findByIdAndUpdate(
          id,
          { deleted: true },
          { new: true }
        );
        if (!softDeletedUser)
          return res.status(404).json({ message: "User not found" });
        return res
          .status(200)
          .json({ message: "User soft deleted", user: softDeletedUser });

      default:
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
