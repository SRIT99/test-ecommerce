// src/components/farmer/DashboardOverview.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { farmerService } from '../../services/farmerService';
import { useAuth } from '../../hooks/useAuth';

const DashboardOverview = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalProducts: 0,
            activeProducts: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            totalItemsSold: 0
        },
        recentOrders: [],
        lowStockProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getStats();
            console.log('Dashboard API Response:', data);

            setDashboardData({
                stats: data.stats || {
                    totalProducts: 0,
                    activeProducts: 0,
                    totalOrders: 0,
                    pendingOrders: 0,
                    totalRevenue: 0,
                    totalItemsSold: 0
                },
                recentOrders: data.recentOrders || [],
                lowStockProducts: data.lowStockProducts || []
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, change, icon, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color} text-white text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-8">
                {/* Welcome Section Skeleton */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-8 bg-green-400 rounded w-64 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-green-400 rounded w-96 animate-pulse"></div>
                        </div>
                        <div className="hidden md:block text-6xl">🌿</div>
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Farmer'}! 👋</h1>
                        <p className="text-green-100 text-lg">
                            Your farm is growing beautifully. Here's what's happening today.
                        </p>
                    </div>
                    <div className="hidden md:block text-6xl">🌿</div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Grid - NOW USING REAL DATA */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Products"
                    value={dashboardData.stats.totalProducts}
                    change={12}
                    icon="🛒"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Products"
                    value={dashboardData.stats.activeProducts}
                    change={8}
                    icon="📈"
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Orders"
                    value={dashboardData.stats.totalOrders}
                    change={15}
                    icon="📦"
                    color="bg-purple-500"
                />
            </div>

            {/* Revenue and Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${dashboardData.stats.totalRevenue}`}
                    change={22}
                    icon="💰"
                    color="bg-amber-500"
                />
                <StatCard
                    title="Pending Orders"
                    value={dashboardData.stats.pendingOrders}
                    change={-5}
                    icon="⏳"
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Items Sold"
                    value={dashboardData.stats.totalItemsSold}
                    change={18}
                    icon="🔥"
                    color="bg-red-500"
                />
                <StatCard
                    title="Stock Value"
                    value={`₹${dashboardData.stats.totalRevenue * 0.3}`} // Example calculation
                    change={10}
                    icon="📊"
                    color="bg-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                        <Link to="/farmer/dashboard/orders" className="text-green-600 hover:text-green-700 font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.recentOrders.length > 0 ? (
                            dashboardData.recentOrders.slice(0, 5).map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group">
                                    <div>
                                        <p className="font-semibold text-gray-900 group-hover:text-green-700">
                                            Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.user?.name || 'Customer'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ₹{order.totals?.grandTotal || 0}
                                        </p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' || order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Created' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">📦</div>
                                <p>No recent orders</p>
                                <p className="text-sm">Orders will appear here when customers place them</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
                        <Link to="/farmer/dashboard/products" className="text-green-600 hover:text-green-700 font-medium">
                            Manage →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.lowStockProducts.length > 0 ? (
                            dashboardData.lowStockProducts.slice(0, 5).map((product, index) => (
                                <div key={product._id || index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div>
                                        <p className="font-semibold text-gray-900">{product.name}</p>
                                        <p className="text-sm text-red-600">
                                            Only {product.stockQty} {product.unit} left
                                        </p>
                                    </div>
                                    <Link
                                        to="/farmer/dashboard/products"
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors font-medium"
                                    >
                                        Restock
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">✅</div>
                                <p>All products are well stocked</p>
                                <p className="text-sm">Great job managing your inventory!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/farmer/dashboard/products?action=add"
                        className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-200 group hover:shadow-md text-center"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Add New Product</h3>
                        <p className="text-sm text-gray-600">List fresh produce from your farm</p>
                    </Link>
                    <Link
                        to="/farmer/dashboard/orders"
                        className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 group hover:shadow-md text-center"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📦</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Manage Orders</h3>
                        <p className="text-sm text-gray-600">Process and track customer orders</p>
                    </Link>
                    <Link
                        to="/farmer/dashboard/analytics"
                        className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 group hover:shadow-md text-center"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                        <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
                        <p className="text-sm text-gray-600">Track sales and performance</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;