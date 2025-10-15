// src/pages/OrderSuccess.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, paymentMethod } = location.state || {};

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    {/* Success Icon */}
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-2">Thank you for your purchase</p>

                    {/* Order Details */}
                    <div className="bg-green-50 rounded-lg p-6 mb-6">
                        <p className="text-lg font-semibold text-green-800 mb-2">
                            Order ID: <span className="font-mono">{orderId || 'N/A'}</span>
                        </p>
                        <p className="text-green-700">
                            Payment Method: <span className="font-medium">{paymentMethod || 'Cash on Delivery'}</span>
                        </p>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-center space-x-3 text-gray-700">
                            <Package className="w-5 h-5 text-green-600" />
                            <span>We're preparing your order</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 text-gray-700">
                            <Truck className="w-5 h-5 text-green-600" />
                            <span>You'll receive delivery updates soon</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/orders"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>View My Orders</span>
                        </Link>
                        <Link
                            to="/products"
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;