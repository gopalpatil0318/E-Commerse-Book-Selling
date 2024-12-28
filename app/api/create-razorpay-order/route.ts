import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { amount } = await req.json();

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const options = {
        amount: amount,
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json(order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

