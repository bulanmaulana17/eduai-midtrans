// api/create-transaction.js
import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, isYearly, amount, userDetails } = req.body;
    
    // Initialize Midtrans client
    const snap = new midtransClient.Snap({
      isProduction: false, // Ganti ke true untuk production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: userDetails.name,
        email: userDetails.email,
        phone: '08123456789' // Anda bisa menambahkan dari user profile
      },
      item_details: [{
        id: planType,
        price: amount,
        quantity: 1,
        name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan (${isYearly ? 'Tahunan' : 'Bulanan'})`
      }]
    };

    // Create transaction
    const transaction = await snap.createTransaction(parameter);
    
    res.status(200).json({
      transactionToken: transaction.token
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
}
