import React from 'react';
import { Link } from 'react-router-dom';

const FarmerHeader = ({ onMenuToggle }) => {
    return (
        <div className="px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-xl hover:bg-green-50 text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                            Farmer Dashboard
                        </h1>
                        <p className="text-gray-600 text-sm hidden sm:block">Manage your farm business</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Quick Stats - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">24</div>
                            <div className="text-gray-500">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">12</div>
                            <div className="text-gray-500">Orders</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-green-600">₹8,240</div>
                            <div className="text-gray-500">Revenue</div>
                        </div>
                    </div>

                    {/* Add Product Button */}
                    <Link
                        to="/farmer/dashboard/products?action=add"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                    >
                        + Add Product
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerHeader;