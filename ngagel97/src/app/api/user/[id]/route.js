import connectDB from "@/app/api/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { jwtVerify } from "jose";

// PUT: Update user profile
export async function PUT(request) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const userId = payload.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const { name, phoneNumber, oldPassword, newPassword } = await request.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (oldPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Incorrect old password" },
          { status: 400 }
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (phoneNumber) user.phone_number = phoneNumber;

    await user.save();

    return NextResponse.json(
      { success: true, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
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
  try {
    const {id} = await params;

    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { user } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}