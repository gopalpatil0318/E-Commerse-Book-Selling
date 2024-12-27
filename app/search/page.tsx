"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BottomNavigation from '@/components/BottomNavigation';
import { RiSearchLine } from "react-icons/ri";
import Link from 'next/link';

interface Book {
  _id: string;
  bookTitle: string;
  imageUrl: string;
  price: number;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      fetchBooks();
    }
  }, [status, router]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/get-books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Error fetching books. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const filteredBooks = books.filter((book) =>
    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-4">
        <form className="max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <RiSearchLine />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </form>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <Link key={book._id} href={`/book-details?id=${book._id}`}>
                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <img
                    className="rounded-t-lg h-40 w-full object-cover"
                    src={book.imageUrl}
                    alt={book.bookTitle}
                  />
                  <div className="p-2">
                    <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                      {book.bookTitle}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      <b>Price: </b>Rs. {book.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
}

