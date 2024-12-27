import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from '@/lib/dbConnect';
import Book from '@/model/Book';
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookTitle, authorName, price, description, imageUrl, category } = await req.json();

    console.log("price",price)

    await dbConnect();

    // Create book with user ID
    const book = await Book.create({
      bookTitle,
      authorName,
      price,
      description,
      imageUrl,
      category,
      user: session.user.id, 
    });

    return NextResponse.json(
      { message: 'Book added successfully', book },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add book error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

