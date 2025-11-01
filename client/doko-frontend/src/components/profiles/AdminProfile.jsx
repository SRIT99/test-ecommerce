import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/adminService';

const AdminProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [adminStats, setAdminStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);

            const [statsResponse, activitiesResponse] = await Promise.all([
                userService.getPlatformStats(),
                userService.getRecentActivities()
            ]);

            setAdminStats(statsResponse.data);
            setRecentActivities(activitiesResponse.data.activities || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        const icons = {
            user_registration: '👤',
            order_placed: '📦',
            payment_received: '💰',
            support_ticket: '🎫',
            system_alert: '⚠️'
        };
        return icons[type] || '📝';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-3xl font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600 mt-1">{user?.email}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                                        Platform Administrator
                                    </span>
                                    <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm font-medium rounded-full">
                                        Super Admin Access
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 lg:mt-0">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white text-center">
                                <p className="text-sm opacity-90">Platform Health</p>
                                <p className="text-2xl font-bold">{adminStats?.platformUptime || '100%'}</p>
                                <p className="text-xs opacity-80 mt-1">Uptime this month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{adminStats?.totalUsers || 0}</p>
                                <p className="text-xs text-green-600 mt-1">+{adminStats?.newUsersToday || 0} today</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{adminStats?.activeOrders || 0}</p>
                                <p className="text-xs text-yellow-600 mt-1">{adminStats?.pendingOrders || 0} pending</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₹{adminStats?.totalRevenue || 0}</p>
                                <p className="text-xs text-green-600 mt-1">₹{adminStats?.revenueToday || 0} today</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Support Tickets</p>
                                <p className="text-2xl font-bold text-gray-900">{adminStats?.openTickets || 0}</p>
                                <p className="text-xs text-red-600 mt-1">{adminStats?.urgentTickets || 0} urgent</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎫</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <span className="text-xl">{getActivityIcon(activity.type)}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${activity.priority === 'high'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {activity.priority}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent activities</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-3">
                                    <span className="text-blue-600">👥</span>
                                    <span className="text-sm font-medium">User Management</span>
                                </button>
                                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-3">
                                    <span className="text-green-600">📊</span>
                                    <span className="text-sm font-medium">View Analytics</span>
                                </button>
                                <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center space-x-3">
                                    <span className="text-yellow-600">⚙️</span>
                                    <span className="text-sm font-medium">System Settings</span>
                                </button>
                                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-3">
                                    <span className="text-purple-600">📝</span>
                                    <span className="text-sm font-medium">Content Moderation</span>
                                </button>
                                <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-3">
                                    <span className="text-red-600">🎫</span>
                                    <span className="text-sm font-medium">Support Tickets</span>
                                </button>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">API Server</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Database</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Payment Gateway</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Email Service</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Degraded</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;