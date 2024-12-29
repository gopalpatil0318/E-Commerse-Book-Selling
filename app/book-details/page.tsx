'use client'

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '../../components/BottomNavigation';
import { FaUserCircle } from "react-icons/fa";
import { RoundLoader } from '@/components/round-loader';

interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  price: number;
  description: string;
  imageUrl: string;
}

function BookDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            const id = searchParams.get('id');
            if (!id) {
                setError('Book ID is missing');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/get-book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch book details');
                }
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError('Error fetching book details. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [searchParams]);

    const handleAddToCart = async () => {
        if (!book) return;

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId: book._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            router.push('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <RoundLoader size={80} color="#009999" borderWidth={6} />
          <p className="mt-4 text-lg font-semibold text-gray-600">Loading book details...</p>
        </div>
      );
    if (error) return <div>Error: {error}</div>;
    if (!book) return <div>No book found</div>;

    return (
        <>
            <div className="bg-[#009999] p-3 flex justify-between">
                <h4 className="text-xl/9 font-bold pl-2 text-white">Book Details</h4>
                <Link href="/profile">
                    <FaUserCircle className="text-3xl text-white m-1" />
                </Link>
            </div>

            <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-20">
                <div className="relative w-full h-64">
                    <Image
                        className="rounded-t-lg object-cover"
                        src={book.imageUrl}
                        alt={book.bookTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="px-5 pb-5">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{book.bookTitle}</h5>
                    <p><b>By {book.authorName}</b></p>
                    <h5 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white py-4">Rs: {book.price}</h5>
                    <p>{book.description}</p>
                    <div>
                        <button
                            onClick={handleAddToCart}
                            className="flex mt-4 w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009999]"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <BottomNavigation />
        </>
    );
}

export default function BookDetails() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <RoundLoader size={80} color="#009999" borderWidth={6} />
              <p className="mt-4 text-lg font-semibold text-gray-600">Loading book details...</p>
            </div>
          }>
      
            <BookDetailsContent />
        </Suspense>
    );
}

