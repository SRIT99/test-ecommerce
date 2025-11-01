// src/components/admin/AdminOverview.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingVerifications: 0,
        activeFarmers: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await userService.getStats();
            console.log('Admin stats data:', data);

            if (data && data.stats) {
                setStats({
                    totalUsers: data.stats.totalUsers || 0,
                    totalProducts: data.stats.totalProducts || 0,
                    totalOrders: data.stats.totalOrders || 0,
                    totalRevenue: data.stats.totalRevenue || 0,
                    pendingVerifications: data.stats.pendingVerifications || 0,
                    activeFarmers: data.stats.activeFarmers || 0
                });
            }
            setRecentActivities(data.recentActivities || []);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, change, icon, color, description }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                        {loading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                        ) : (
                            value
                        )}
                    </p>
                    {change && (
                        <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
                        </p>
                    )}
                    {description && (
                        <p className="text-xs text-gray-500 mt-2">{description}</p>
                    )}
                </div>
                <div className={`p-4 rounded-xl ${color} text-white text-2xl group-hover:scale-110 transition-transform duration-200`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                        <p className="text-blue-100 text-lg">
                            Here's what's happening with your agro marketplace today.
                        </p>
                    </div>
                    <div className="hidden md:block text-6xl">🏪</div>
                </div>
            </div>

            {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            change={stats.totalUsers > 0 ? 12 : 0}
                            icon="👥"
                            color="bg-blue-500"
                            description="Registered users"
                        />
                        <StatCard
                            title="Total Products"
                            value={stats.totalProducts}
                            change={stats.totalProducts > 0 ? 8 : 0}
                            icon="🛒"
                            color="bg-green-500"
                            description="Active listings"
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.totalOrders}
                            change={stats.totalOrders > 0 ? 15 : 0}
                            icon="📦"
                            color="bg-purple-500"
                            description="Completed orders"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Platform Revenue"
                            value={`₹${stats.totalRevenue}`}
                            change={stats.totalRevenue > 0 ? 22 : 0}
                            icon="💰"
                            color="bg-amber-500"
                            description="Total earnings"
                        />
                        <StatCard
                            title="Pending Verifications"
                            value={stats.pendingVerifications}
                            change={stats.pendingVerifications > 0 ? -5 : 0}
                            icon="⏳"
                            color="bg-yellow-500"
                            description="Farmers awaiting approval"
                        />
                        <StatCard
                            title="Active Farmers"
                            value={stats.activeFarmers}
                            change={stats.activeFarmers > 0 ? 18 : 0}
                            icon="👨‍🌾"
                            color="bg-emerald-500"
                            description="Verified sellers"
                        />
                    </div>
                </>
            )}

            {/* Quick Stats & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/admin/dashboard/users"
                            className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 group hover:shadow-md text-left block"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">✅</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Verify Farmers</h3>
                            <p className="text-sm text-gray-600">
                                {loading ? 'Loading...' : `${stats.pendingVerifications} pending`}
                            </p>
                        </Link>
                        <Link
                            to="/admin/dashboard/analytics"
                            className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-200 group hover:shadow-md text-left block"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                            <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                            <p className="text-sm text-gray-600">Platform insights</p>
                        </Link>
                        <Link
                            to="/admin/dashboard/prices"
                            className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 group hover:shadow-md text-left block"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔄</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Sync Prices</h3>
                            <p className="text-sm text-gray-600">Update market rates</p>
                        </Link>
                        <Link
                            to="/admin/dashboard/users"
                            className="p-4 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-200 group hover:shadow-md text-left block"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👤</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
                            <p className="text-sm text-gray-600">
                                {loading ? 'Loading...' : `${stats.totalUsers} users`}
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <span className="text-sm text-blue-600 font-medium">View All</span>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
                                    <div className={`p-2 rounded-lg ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'order' ? 'bg-green-100 text-green-600' :
                                                activity.type === 'product' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {activity.type === 'user' ? '👤' :
                                            activity.type === 'order' ? '📦' :
                                                activity.type === 'product' ? '🛒' : '⚡'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 group-hover:text-blue-700">
                                            {activity.message}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">📝</div>
                                <p>No recent activity</p>
                                <p className="text-sm">Activities will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;