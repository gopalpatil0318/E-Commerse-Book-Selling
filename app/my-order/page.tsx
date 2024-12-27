'use client'

import { useState, useEffect } from 'react';
import { Loader2, Package, MapPin, Phone, DollarSign, Calendar, Truck } from 'lucide-react';
import BottomNavigation from "@/components/BottomNavigation";

interface OrderItem {
  _id: string;
  book: {
    _id: string;
    bookTitle: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
  price: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  address: string;
  mobileNumber: string;
  paymentId: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export default function MyOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Error fetching orders. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500';
      case 'Confirmed': return 'text-blue-500';
      case 'Shipped': return 'text-purple-500';
      case 'Delivered': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-[#009999] animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#009999] p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
      </div>

      <div className="p-4 pb-20">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10">
            <Package className="w-16 h-16 text-gray-400" />
            <p className="mt-4 text-lg font-semibold text-gray-700">No orders found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h2>
                   
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Rs. {order.total}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.mobileNumber}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Ordered Items:</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-start space-x-4 p-2 bg-gray-50 rounded-md">
                        <img
                          src={item.book.imageUrl}
                          alt={item.book.bookTitle}
                          className="w-16 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.book.bookTitle}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: Rs. {item.price}</p>
                          <div className="flex items-center mt-1">
                            <Truck className="w-4 h-4 mr-1" />
                            <span className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

