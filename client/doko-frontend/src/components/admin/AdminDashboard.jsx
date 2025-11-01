// src/components/admin/AdminDashboard.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview'; // Extracted from previous component
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import PriceSync from './PriceSync';
//import VehicleManagement from './VehicleManagement';
import Analytics from './Analytics';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Additional protection (though ProtectedRoute already handles this)
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
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
                            <Route index element={<AdminOverview />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="prices" element={<PriceSync />} />
                            {/* <Route path="vehicles" element={<VehicleManagement />} /> */}
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;