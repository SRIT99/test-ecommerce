import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import PriceSync from '../components/admin/PriceSync';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Redirect non-admin users
    if (user?.userType !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const AdminOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <span className="text-2xl">🛒</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                        <span className="text-2xl">📦</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹0</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your agro marketplace platform</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Routes>
                            <Route path="/" element={<AdminOverview />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/prices" element={<PriceSync />} />
                            <Route path="/products" element={<div>Product Management - Coming Soon</div>} />
                            <Route path="/orders" element={<div>Order Management - Coming Soon</div>} />
                            <Route path="/vehicles" element={<div>Vehicle Management - Coming Soon</div>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;