import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { amount } = await req.json();

      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials are missing');
        return NextResponse.json({ error: 'Razorpay credentials are missing' }, { status: 500 });
      }

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount,
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };

      console.log('Creating Razorpay order with options:', options);

      const order = await razorpay.orders.create(options);

      console.log('Razorpay order created:', order);

      return NextResponse.json(order);
    } catch (error: unknown) {
      console.error('Error creating Razorpay order:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ error: 'Failed to create order', details: 'An unknown error occurred' }, { status: 500 });
      }
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

