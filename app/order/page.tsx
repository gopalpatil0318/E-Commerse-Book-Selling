"use client"

import { useState, useEffect } from "react";
import { Loader2, Package, User, MapPin, Phone, XCircle, IndianRupee } from 'lucide-react';

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
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  address: string;
  mobileNumber: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/seller-order');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemStatus = async (orderId: string, itemId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item status');
      }

      setOrders(orders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            items: order.items.map(item => 
              item._id === itemId ? { ...item, status: newStatus as 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' } : item
            )
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status. Please try again.');
    }
  };

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
        <XCircle className="w-16 h-16 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-gray-700">{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-[#009999] text-white rounded-md hover:bg-[#007777] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#009999] p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Seller Orders</h1>
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
                      <User className="w-4 h-4 mr-2" />
                      {order.user.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.mobileNumber}
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-2" />
                       {order.total}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Ordered Books:</h3>
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
                          <p className="text-sm text-gray-600">Price: Rs. {item.book.price}</p>
                          <div className="mt-2">
                            <label htmlFor={`status-${item._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                              Update Status
                            </label>
                            <select
                              id={`status-${item._id}`}
                              value={item.status}
                              onChange={(e) => updateItemStatus(order._id, item._id, e.target.value)}
                              className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-[#009999] focus:ring focus:ring-[#009999] focus:ring-opacity-50"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
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

