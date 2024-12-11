import connectDB from "@/app/api/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// PUT: Update user profile
export async function PUT(request, { params }) {
  const { id } = await params; // Access params.id directly

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Ensure DB connection is successful

    const { name, phoneNumber, oldPassword, newPassword } =
      await request.json();

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate and update password if provided
    if (oldPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return new Response(
          JSON.stringify({ error: "Incorrect old password" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Hash and set the new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    if (name) user.name = name;
    if (phoneNumber) user.phone_number = phoneNumber;

    // Save the updated user
    await user.save();

    return new Response(
      JSON.stringify({ message: "User updated successfully", user }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Soft delete or unban user
export async function DELETE(request, { params }) {
  const { id } = await params; // Access params.id directly

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Ensure DB connection is successful
    const user = await User.findById(id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Toggle 'deleted' status (if already deleted, set it back to false, i.e., unban)
    const newStatus = user.deleted ? false : true;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { deleted: newStatus }, // Toggle delete status (soft delete or unban)
      { new: true }
    );

    return new Response(
      JSON.stringify({ message: "User status updated", user: updatedUser }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to update user status" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request, { params }) {
  const { id } = await params; // Access params.id directly

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const user = await User.findById(id);
    console.log(user);

    return NextResponse.json(
      { success: true, data: { user: user } }, // Pastikan ada properti "items"
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
