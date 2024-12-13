import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
   
    await connectDB();

    // Perbaikan query menggunakan $in
    let orders = await Transaksi.find({
      isOnline: true,
      status: { $in: ["pending", "progress"] }, // Menggunakan operator $in
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: true, data: { orders: [] } },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: { orders: orders } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetch orders:", error);
    return NextResponse.json(
      { success: false, message: "Error fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
