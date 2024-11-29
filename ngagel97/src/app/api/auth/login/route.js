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

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json({ message: "Login successful" });

    // Set token in cookie
    response.cookies.set("token", token, {
      httpOnly: true, // So the cookie is not accessible by JS
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 12, // Token expiry (12 hours)
      path: "/", // Make the cookie accessible site-wide
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
