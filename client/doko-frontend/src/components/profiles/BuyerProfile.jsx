import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/adminService';

const BuyerProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [buyerStats, setBuyerStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBuyerData();
    }, []);

    const fetchBuyerData = async () => {
        try {
            setLoading(true);

            // Fetch buyer stats and recent orders
            const [statsResponse, ordersResponse] = await Promise.all([
                userService.getBuyerStats(),
                orderService.getBuyerOrders({ limit: 5 })
            ]);

            setBuyerStats(statsResponse.data);
            setRecentOrders(ordersResponse.data.orders || []);
        } catch (error) {
            console.error('Error fetching buyer data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            processing: 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-3xl font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'B'}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600 mt-1">{user?.email}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        Verified Buyer
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                                        Member since {new Date(user?.createdAt).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 lg:mt-0">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white text-center">
                                <p className="text-sm opacity-90">Loyalty Points</p>
                                <p className="text-2xl font-bold">{buyerStats?.loyaltyPoints || 0}</p>
                                <p className="text-xs opacity-80 mt-1">Available to redeem</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{buyerStats?.totalOrders || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">₹{buyerStats?.totalSpent || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{buyerStats?.activeOrders || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Saved Items</p>
                                <p className="text-2xl font-bold text-gray-900">{buyerStats?.savedItems || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Content */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-8">
                            {['overview', 'orders', 'preferences', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Orders */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                                <div className="space-y-4">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <div key={order._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                                                        <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No recent orders</p>
                                    )}
                                </div>
                            </div>

                            {/* Favorite Categories */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Preferences</h3>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Favorite Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(buyerStats?.favoriteCategories || []).map((category, index) => (
                                            <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border">
                                                {category}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Delivery Preferences</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p>• {user?.location || 'Location not set'}</p>
                                            <p>• Standard Delivery</p>
                                            <p>• Contactless Preferred</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                            {/* Order history table/component would go here */}
                            <p className="text-gray-500 text-center py-8">Order history feature coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Preferences</h3>
                            {/* Preferences form would go here */}
                            <p className="text-gray-500 text-center py-8">Preferences management coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Reviews</h3>
                            {/* Reviews component would go here */}
                            <p className="text-gray-500 text-center py-8">Review history coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;