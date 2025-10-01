import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
        { path: '/admin/users', icon: '👥', label: 'User Management' },
        { path: '/admin/products', icon: '🛒', label: 'Product Management' },
        { path: '/admin/orders', icon: '📦', label: 'Order Management' },
        { path: '/admin/vehicles', icon: '🚚', label: 'Vehicle Management' },
        { path: '/admin/prices', icon: '💰', label: 'Price Sync' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg h-fit sticky top-4">
            <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path, item.exact)
                                        ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar;