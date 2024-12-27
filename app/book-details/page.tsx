'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '../../components/BottomNavigation';
import { FaUserCircle } from "react-icons/fa";

interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function BookDetails() {
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
                const response = await fetch(`/api/get-books/${id}`);
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

    if (isLoading) return <div>Loading...</div>;
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

            <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img className="p-8 rounded-t-lg w-full" src={book.imageUrl} alt={book.bookTitle} />
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

