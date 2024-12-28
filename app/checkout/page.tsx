'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import { useSession } from 'next-auth/react';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

interface CartItem {
    bookId: {
        price: number;
    };
    quantity: number;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export default function Checkout() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const router = useRouter();
    const { status } = useSession();
    const { error, isLoading, Razorpay } = useRazorpay();

    const handlePayment = async () => {
        if (!mobileNumber || !address) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const cartResponse = await fetch('/api/cart');
            const cartItems: CartItem[] = await cartResponse.json();

            const total = cartItems.reduce(
                (sum, item) => sum + item.bookId.price * item.quantity,
                0
            );

            // Create Razorpay order
            const orderResponse = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total * 100 }), // Convert to paise
            });
            const orderData = await orderResponse.json();

            const options: RazorpayOrderOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount.toString(),
                currency: "INR",
                name: "Your Bookstore",
                description: "Book Purchase",
                order_id: orderData.id,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyResponse = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (verifyResponse.ok) {
                            const saveOrderResponse = await fetch('/api/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    address,
                                    mobileNumber,
                                    items: cartItems,
                                    total,
                                }),
                            });

                            if (saveOrderResponse.ok) {
                                await fetch('/api/delete-cart', { method: 'DELETE' });
                                router.push('/my-order');
                            } else {
                                alert('Failed to save order. Please contact support.');
                            }
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Error processing payment:', error);
                        alert('Failed to process payment. Please try again.');
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: mobileNumber,
                },
                theme: {
                    color: "#009999",
                },
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Failed to initiate payment. Please try again.');
        }
    };

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>;
    }

    if (status !== 'authenticated') {
        router.push('/login');
        return null;
    }

    return (
        <>
            <div className='bg-[#009999] p-3 flex justify-between'>
                <h4 className='text-xl/9 font-bold pl-2 text-white'>Checkout</h4>
            </div>

            <div className="p-4">
                <div className="mt-10">
                    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-2">
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm/6 w-full font-medium text-gray-900">
                                Mobile Number
                            </label>
                            <div className="mt-2">
                                <input
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="tel"
                                    required
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                                Address
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex mt-12 w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Checkout'}
                            </button>
                        </div>
                    </form>
                </div>
                {error && <p className="text-red-500 mt-4">Error loading Razorpay: {error}</p>}
            </div>
            <BottomNavigation />
        </>
    );
}

