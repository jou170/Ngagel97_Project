import { NextResponse } from "next/server";

export async function GET(request) {
  // Menghapus cookie 'token' yang menyimpan informasi login
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Menghapus cookie dengan nama 'token'
  response.cookies.delete("token");
  response.cookies.delete("role");

  return response;
}
