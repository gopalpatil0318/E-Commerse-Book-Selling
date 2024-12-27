import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/model/cart';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function DELETE(req: Request) {
    try {
      await dbConnect();
      const session = await getServerSession(authOptions);
  
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      // Delete all cart items for the user
      await Cart.deleteMany({ userEmail: session.user.email });
  
      return NextResponse.json({ message: 'All items removed from cart' }, { status: 200 });
    } catch (error) {
      console.error('Error removing all items from cart:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  