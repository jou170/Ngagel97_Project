// pages/api/midtrans/createTransaction.js
import midtransClient from "midtrans-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Inisialisasi Midtrans Client
  const { orderId, grossAmount } = req.body;
  const coreApi = new midtransClient.CoreApi({
    isProduction: false, // Set true jika di production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  try {
    const parameter = {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      bank_transfer: {
        bank: "bca", // Ubah ke bank lain jika diperlukan
      },
    };

    const transaction = await coreApi.charge(parameter);
    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Midtrans transaction error:", error.message);
    return res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
}
