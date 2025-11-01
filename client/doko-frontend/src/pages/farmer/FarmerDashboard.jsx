import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FarmerSidebar from './FarmerSidebar';
import FarmerHeader from './FarmerHeader';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import FarmerProfile from './FarmerProfile';
import FarmerAnalytics from './FarmerAnalytics';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect non-farmers
  if (user?.roles !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 flex">
      {/* Sidebar - Always visible on desktop, conditional on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-green-200/50
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <FarmerSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-green-200/50">
          <FarmerHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Page Content - Proper scrolling area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="profile" element={<div className="text-center py-12"><FarmerProfile /></div>} />
              <Route path="analytics" element={<div className="text-center py-12"><FarmerAnalytics /></div>} />
              <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;