'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNavigation from "../../components/BottomNavigation";
import { FaUserCircle } from "react-icons/fa";

// TypeScript types
interface Book {
  _id: string;
  bookTitle: string;
  imageUrl: string;
  price: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 'fiction', name: "Fiction" },
    { id: 'non-fiction', name: "Non-Fiction" },
    { id: 'education', name: "Education" },
    { id: 'comic', name: "Comic" },
    { id: 'spiritual', name: "Spiritual" },
    { id: 'literature', name: "Literature" },
    { id: 'health', name: "Health" },
    { id: 'finance', name: "Finance" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `/api/get-books?category=${selectedCategory}`
        : '/api/get-books';
      const response = await fetch(url);
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

  return (
    <>
      {/* Header */}
      <div className="bg-[#009999] p-3 flex justify-between">
        <h4 className="text-xl/9 font-bold pl-2 text-white">BookSwap</h4>
        <Link href="/profile">
          <FaUserCircle className="text-3xl text-white m-1" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="duration-700 ease-in-out w-full p-4" data-carousel-item>
        <img
          src="https://wallpapercave.com/wp/wp2036967.jpg"
          className="w-full block rounded-2xl h-40"
          alt="..."
        />
      </div>

      {/* Categories */}
      <div className="p-4 py-0">
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="inline-flex rounded-md shadow-sm gap-2 w-max">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`cursor-pointer rounded-2xl pr-4 p-2 flex gap-2 ${selectedCategory === category.id ? 'bg-[#009999] text-white' : 'bg-[#00999920]'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <img src="./non-fiction.png" className="w-[40px] h-auto" alt="" />
                {category.name}
              </div>
            ))}
            <div
              className={`cursor-pointer rounded-2xl px-4 p-2 ${selectedCategory === null ? 'bg-[#009999] text-white' : 'bg-[#00999920]'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </div>
          </div>
        </div>
      </div>

      {/* Books */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {books.map((book) => (
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}

