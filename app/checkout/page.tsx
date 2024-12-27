'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import { useSession } from 'next-auth/react';
import DummyPayment from '@/components/DummyPayment';

export default function Checkout() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleNext = async () => {
        if (!mobileNumber || !address) {
            alert('Please fill in all fields');
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async (paymentDetails: any) => {
        try {
            // Fetch cart items
            const cartResponse = await fetch('/api/cart');
            const cartItems = await cartResponse.json();
            
            // Calculate total
            const total = cartItems.reduce((sum: number, item: any) => sum + (item.bookId.price * item.quantity), 0);

            // Save order to database
            const saveOrderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: paymentDetails.paymentId,
                    address,
                    mobileNumber,
                    items: cartItems,
                    total
                })
            });

            if (saveOrderResponse.ok) {
                // Clear cart
                await fetch('/api/delete-cart', { method: 'DELETE' });
                router.push('/my-order');
            } else {
                alert('Failed to save order. Please contact support.');
            }
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Failed to save order. Please contact support.');
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status !== "authenticated") {
        router.push('/login');
        return null;
    }

    return (
        <>
            <div className='bg-[#009999] p-3 flex justify-between'>
                <h4 className='text-xl/9 font-bold pl-2 text-white'>Checkout</h4>
            </div>

            <div className="p-4">
                {!showPayment ? (
                    <div className="mt-10">
                        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-2">
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
                                    className="flex mt-12 w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <DummyPayment onSuccess={handlePaymentSuccess} />
                )}
            </div>
            <BottomNavigation />
        </>
    );
}

