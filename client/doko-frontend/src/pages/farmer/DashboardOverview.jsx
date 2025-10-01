import React from 'react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
    // Mock data - replace with actual API calls
    const stats = {
        totalProducts: 24,
        activeProducts: 18,
        totalOrders: 12,
        pendingOrders: 3,
        totalRevenue: 8240,
        totalItemsSold: 156
    };

    const recentOrders = [
        { id: 'ORD-001', customer: 'Ram Sharma', amount: 1200, status: 'Delivered', date: '2024-01-15' },
        { id: 'ORD-002', customer: 'Sita Kumari', amount: 800, status: 'Processing', date: '2024-01-14' },
        { id: 'ORD-003', customer: 'Hari Prasad', amount: 1500, status: 'Delivered', date: '2024-01-13' },
    ];

    const lowStockProducts = [
        { name: 'Organic Tomatoes', stock: 5, unit: 'kg' },
        { name: 'Fresh Spinach', stock: 3, unit: 'bunch' },
        { name: 'Carrots', stock: 8, unit: 'kg' },
    ];

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

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
                        <p className="text-green-100 text-lg">
                            Your farm is growing beautifully. Here's what's happening today.
                        </p>
                    </div>
                    <div className="hidden md:block text-6xl">🌿</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    change={12}
                    icon="🛒"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Products"
                    value={stats.activeProducts}
                    change={8}
                    icon="📈"
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    change={15}
                    icon="📦"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue}`}
                    change={22}
                    icon="💰"
                    color="bg-amber-500"
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
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group">
                                <div>
                                    <p className="font-semibold text-gray-900 group-hover:text-green-700">{order.id}</p>
                                    <p className="text-sm text-gray-600">{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">₹{order.amount}</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
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
                        {lowStockProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                <div>
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-sm text-red-600">Only {product.stock} {product.unit} left</p>
                                </div>
                                <Link
                                    to="/farmer/dashboard/products"
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors font-medium"
                                >
                                    Restock
                                </Link>
                            </div>
                        ))}
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