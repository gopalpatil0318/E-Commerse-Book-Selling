import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/model/Order';
// import User from '@/model/User';




export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({ 'items.sellerId': session.user.id })
      .populate('user', 'name email')
      .populate('items.book')
      .sort({ createdAt: -1 });

      console.log(orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

