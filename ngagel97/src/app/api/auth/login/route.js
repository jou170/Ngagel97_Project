import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/app/api/mongoose";
import { NextResponse } from "next/server";
const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  await connectDB();

  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    // Cek apakah user ditemukan
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email",
          data: null,
          error: "User not found",
        },
        { status: 401 }
      );
    }

    // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password",
          data: null,
          error: "Incorrect password",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: { token },
      error: null,
    });

    // Set token di cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        data: null,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
