// api/create-transaction.js
import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  // 1. TAMBAHKAN HEADER CORS DI SINI (SEBELUM PROSES UTAMA)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 2. Handle preflight request (OPTIONS method)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Pastikan hanya menerima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, isYearly, amount, userDetails } = req.body;
    
    // Initialize Midtrans client
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // ... (kode Midtrans yang sudah ada) ...

    const transaction = await snap.createTransaction(parameter);
    
    res.status(200).json({
      transactionToken: transaction.token
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
}
