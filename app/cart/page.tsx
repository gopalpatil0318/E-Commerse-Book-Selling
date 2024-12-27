'use client'

import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";

interface CartItem {
  _id: string;
  bookId: {
    _id: string;
    bookTitle: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      setCartItems(data);
    } catch (err) {
      setError('Error fetching cart items. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.bookId.price * item.quantity), 0);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="bg-[#009999] p-3 flex justify-between">
        <h4 className="text-xl/9 font-bold pl-2 text-white">Cart</h4>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map((item) => (

            <Link href={`/book-details?id=${item.bookId._id}`}>  
                     <div
              key={item._id}
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex"
            >
              <img
                className="rounded-t-lg h-20 w-16 object-cover"
                src={item.bookId.imageUrl}
                alt={item.bookId.bookTitle}
              />
              <div className="p-2 flex-grow">
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.bookId.bookTitle}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <b>Price: </b>Rs. {item.bookId.price}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                 
                </p>
              </div>
              <MdOutlineDelete
                className="text-2xl m-6 mr-4 cursor-pointer"
                onClick={() => handleDelete(item._id)}
              />
            </div>
            </Link>

          ))}
        </div>
      </div>

      <div className="p-4 mt-20">
        <h3 className="mt-10 text-xl/9 font-bold tracking-tight text-gray-900">
          Total: Rs. {totalPrice}
        </h3>

        <div>
          <Link href="/checkout">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}

