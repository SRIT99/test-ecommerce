// src/components/farmer/FarmerAnalytics.js
import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';

const FarmerAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        salesData: [],
        topProducts: [],
        monthlyRevenue: [],
        customerStats: {}
    });
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await farmerService.getFarmerAnalytics({ range: timeRange });
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, change, icon, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
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

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                        <p className="text-gray-600">Track your farm's performance</p>
                    </div>
                    <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600">Track your farm's performance and growth</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                </select>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${analytics.totalRevenue || 0}`}
                    change={12}
                    icon="💰"
                    color="bg-green-500"
                />
                <StatCard
                    title="Orders Completed"
                    value={analytics.completedOrders || 0}
                    change={8}
                    icon="📦"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Products Sold"
                    value={analytics.productsSold || 0}
                    change={15}
                    icon="🛒"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Customer Growth"
                    value={`${analytics.customerGrowth || 0}%`}
                    change={5}
                    icon="👥"
                    color="bg-amber-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">📊</div>
                            <p>Revenue chart will be displayed here</p>
                            <p className="text-sm">Integration with charts library needed</p>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        {analytics.topProducts && analytics.topProducts.length > 0 ? (
                            analytics.topProducts.map((product, index) => (
                                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-600">{product.quantitySold} units sold</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">₹{product.revenue}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🌱</div>
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="space-y-3">
                        {[
                            { status: 'Delivered', count: analytics.deliveredOrders || 0, color: 'bg-green-500' },
                            { status: 'Processing', count: analytics.processingOrders || 0, color: 'bg-yellow-500' },
                            { status: 'Pending', count: analytics.pendingOrders || 0, color: 'bg-blue-500' },
                            { status: 'Cancelled', count: analytics.cancelledOrders || 0, color: 'bg-red-500' }
                        ].map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                                    <div className="w-3 h-3 rounded-full ${item.color}"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Insights */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Repeat Customers</span>
                            <span className="font-semibold text-gray-900">{analytics.repeatCustomers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Average Order Value</span>
                            <span className="font-semibold text-green-600">₹{analytics.avgOrderValue || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Customer Satisfaction</span>
                            <span className="font-semibold text-amber-600">{analytics.satisfactionRate || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerAnalytics;