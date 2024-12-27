'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: (response: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPayment({ amount, onSuccess }: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Create order by calling the server endpoint
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount * 100, currency: 'INR' }) // Convert to paise
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const order = await response.json();

      // Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'BookSwap',
        description: 'Book Purchase',
        order_id: order.id,
        handler: function (response: any) {
          onSuccess(response);
        },
        prefill: {
          name: 'BookSwap User',
          email: 'user@example.com',
          contact: ''
        },
        theme: {
          color: '#009999'
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="flex w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009999]"
    >
      {isLoading ? 'Processing...' : 'Proceed to Payment'}
    </button>
  );
}

