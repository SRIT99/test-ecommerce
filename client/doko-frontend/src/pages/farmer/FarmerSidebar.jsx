import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const FarmerSidebar = ({ onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/farmer/dashboard', icon: '📊', label: 'Dashboard', exact: true },
        { path: '/farmer/dashboard/products', icon: '🛒', label: 'Products' },
        { path: '/farmer/dashboard/orders', icon: '📦', label: 'Orders' },
        { path: '/farmer/dashboard/analytics', icon: '📈', label: 'Analytics' },
        { path: '/farmer/dashboard/profile', icon: '👤', label: 'Profile' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose(); // Close sidebar on mobile
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-green-200/50">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">🌱</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                            DOKO Farmer
                        </h1>
                        <p className="text-sm text-gray-500">Agro Marketplace</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-green-200/50">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.farmName || 'Farm Business'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                            // Close sidebar on mobile after navigation
                            if (window.innerWidth < 1024) {
                                onClose();
                            }
                        }}
                        className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive(item.path, item.exact)
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-700 hover:shadow-md'
                            }
            `}
                    >
                        <span className="text-xl transition-transform group-hover:scale-110">
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {isActive(item.path, item.exact) && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-green-200/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default FarmerSidebar;