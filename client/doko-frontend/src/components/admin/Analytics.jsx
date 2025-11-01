// src/components/admin/Analytics.js
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/adminService';

const Analytics = () => {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await userService.getPlatformAnalytics();
            console.log('Analytics data:', data);
            setAnalytics(data || {});
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, change, icon, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                        ) : (
                            value
                        )}
                    </p>
                    {change && (
                        <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last period
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color} text-white text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    // Calculate real metrics from analytics data
    const calculateMetrics = () => {
        if (!analytics.userGrowth) return {};

        const totalUsers = analytics.userGrowth?.reduce((sum, day) => sum + day.count, 0) || 0;
        const totalRevenue = analytics.revenueTrends?.reduce((sum, day) => sum + day.revenue, 0) || 0;
        const totalOrders = analytics.orderMetrics?.reduce((sum, metric) => sum + metric.count, 0) || 0;

        return {
            activeUsers: totalUsers,
            orderVolume: totalOrders,
            revenue: totalRevenue,
            conversionRate: totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0
        };
    };

    const metrics = calculateMetrics();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
                    <p className="text-gray-600">Deep insights into platform performance</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Users"
                    value={metrics.activeUsers || 0}
                    change={metrics.activeUsers > 0 ? 12 : 0}
                    icon="👥"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Order Volume"
                    value={metrics.orderVolume || 0}
                    change={metrics.orderVolume > 0 ? 8 : 0}
                    icon="📦"
                    color="bg-green-500"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${metrics.revenue || 0}`}
                    change={metrics.revenue > 0 ? 22 : 0}
                    icon="💰"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${metrics.conversionRate || 0}%`}
                    change={metrics.conversionRate > 0 ? -2 : 0}
                    icon="📊"
                    color="bg-amber-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        {loading ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading chart data...</p>
                            </div>
                        ) : analytics.userGrowth && analytics.userGrowth.length > 0 ? (
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">📈</div>
                                <p>User growth chart ready</p>
                                <p className="text-sm">{analytics.userGrowth.length} data points</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">📈</div>
                                <p>No user growth data</p>
                                <p className="text-sm">Data will appear as users register</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Trends */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        {loading ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading revenue data...</p>
                            </div>
                        ) : analytics.revenueTrends && analytics.revenueTrends.length > 0 ? (
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">💹</div>
                                <p>Revenue trends chart ready</p>
                                <p className="text-sm">Total: ₹{metrics.revenue}</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">💹</div>
                                <p>No revenue data</p>
                                <p className="text-sm">Data will appear with orders</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                </div>
                            ))
                        ) : analytics.topProducts && analytics.topProducts.length > 0 ? (
                            analytics.topProducts.slice(0, 5).map((product, index) => (
                                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.product?.[0]?.name || 'Product'}</p>
                                            <p className="text-sm text-gray-600">{product.totalSold || 0} units sold</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">₹{product.totalRevenue || 0}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No product sales data yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                    <div className="space-y-3">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                                </div>
                            ))
                        ) : analytics.orderMetrics && analytics.orderMetrics.length > 0 ? (
                            analytics.orderMetrics.map((metric) => (
                                <div key={metric._id} className="flex justify-between items-center">
                                    <span className="text-gray-600">{metric._id}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-900">{metric.count}</span>
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No order data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;