import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Book from '@/model/Book';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const book = await Book.findById(params.id);
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

