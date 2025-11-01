// src/components/admin/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/admin/dashboard/users', icon: '👥', label: 'User Management' },
        { path: '/admin/dashboard/products', icon: '🛒', label: 'Products' },
        { path: '/admin/dashboard/orders', icon: '📦', label: 'Orders' },
        { path: '/admin/dashboard/prices', icon: '💰', label: 'Price Sync' },
        { path: '/admin/dashboard/vehicles', icon: '🚚', label: 'Vehicles' },
        { path: '/admin/dashboard/analytics', icon: '📊', label: 'Analytics' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h3>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* System Status */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">System Status</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Platform</span>
                        <span className="text-green-600 font-medium">Online</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync</span>
                        <span className="text-gray-900">2h ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;