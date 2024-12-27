import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/model/Order';

interface OrderItem {
  bookId: {
    _id: string;
    price: number;
    user: string;
  };
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  total: number;
  address: string;
  mobileNumber: string;
  paymentId: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData: OrderData = await req.json();

    const newOrder = new Order({
      user: session.user.id,
      items: await Promise.all(orderData.items.map(async (item: OrderItem) => {
        return {
          book: item.bookId._id,
          quantity: item.quantity,
          price: item.bookId.price,
          sellerId: item.bookId.user,
          status: 'Pending',
        };
      })),
      total: orderData.total,
      address: orderData.address,
      mobileNumber: orderData.mobileNumber,
      paymentId: orderData.paymentId,
      status: 'Pending',
    });

    await newOrder.save();

    return NextResponse.json({ message: 'Order placed successfully', order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({ user: session.user.id })
      .populate('items.book')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
