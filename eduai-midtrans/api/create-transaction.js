import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  try {
    // Inisialisasi Snap Midtrans
    let snap = new midtransClient.Snap({
      isProduction: false, // Gunakan false untuk mode sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Data dari frontend
    const { planType, isYearly, amount, userDetails } = req.body;

    // Buat ID transaksi unik
    const orderId = `EDUAI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Parameter transaksi
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      item_details: [{
        id: planType,
        price: amount,
        quantity: 1,
        name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan (${isYearly ? 'Tahunan' : 'Bulanan'})`,
        category: 'Digital Subscription'
      }],
      customer_details: {
        first_name: userDetails.name || 'Customer',
        email: userDetails.email || 'customer@example.com',
        phone: '08123456789'
      }
    };

    // Buat transaksi token
    const transaction = await snap.createTransaction(parameter);
    
    // Kirim token ke frontend
    res.status(200).json({
      transactionToken: transaction.token,
      redirectUrl: transaction.redirect_url
    });
    
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
}