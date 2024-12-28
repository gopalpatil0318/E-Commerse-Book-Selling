import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from '@/lib/dbConnect';
import Order from '@/model/Order';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId, itemId, status } = await req.json();

    if (!orderId || !itemId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const item = order.items.id(itemId);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found in the order' },
        { status: 404 }
      );
    }

    item.status = status;
    await order.save();

    return NextResponse.json(
      { message: 'Item status updated successfully', order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update item status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
