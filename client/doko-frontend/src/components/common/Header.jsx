import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Shield, Package, ShoppingBag, Users, BarChart3 } from 'lucide-react';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartItemsCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        closeAllMenus();
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    // Get profile route based on user role
    const getProfileRoute = () => {
        const userRole = user?.role;

        switch (userRole) {
            case 'seller':
                return '/seller-profile';
            case 'buyer':
                return '/buyer-profile';
            case 'admin':
            case 'superadmin':
                return '/admin-profile';
            default:
                return '/profile';
        }
    };

    // Get user role display name
    const getUserRoleDisplay = () => {
        const userRole = user?.role;

        switch (userRole) {
            case 'seller':
                return 'Seller';
            case 'buyer':
                return 'Buyer';
            case 'admin':
                return 'Admin';
            case 'superadmin':
                return 'Super Admin';
            default:
                return 'User';
        }
    };

    // Check if user has access to admin panel
    const canAccessAdmin = () => {
        const userRole = user?.role;
        return userRole === 'admin' || userRole === 'superadmin';
    };

    // Check if user is seller
    const isSeller = () => {
        const userRole = user?.role;
        return userRole === 'seller';
    };

    // Check if user is buyer
    const isBuyer = () => {
        const userRole = user?.role;
        return userRole === 'buyer';
    };

    // Check if route is active
    const isActiveRoute = (path) => {
        return location.pathname.startsWith(path);
    };

    // Handle signup navigation with user type
    const handleSignupNavigation = (userType = 'buyer') => {
        if (userType === 'seller') {
            navigate('/signup?type=seller');
        } else {
            navigate('/signup');
        }
        closeAllMenus();
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={closeAllMenus}>
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">DOKO</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveRoute('/') && location.pathname === '/'
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveRoute('/products')
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                }`}
                        >
                            Products
                        </Link>
                        <Link
                            to="/weather"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveRoute('/weather')
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                }`}
                        >
                            Weather
                        </Link>
                        <Link
                            to="/liveMarket"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveRoute('/liveMarket')
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                }`}
                        >
                            LiveMarket
                        </Link>

                        {isAuthenticated && canAccessAdmin() && (
                            <Link
                                to="/admin/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${isActiveRoute('/admin')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Shield className="w-4 h-4 mr-1" />
                                Admin Panel
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart Icon - Always visible for buyers and non-logged in users */}
                        {(isBuyer() || !isAuthenticated) && (
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        {user?.name || 'User'}
                                    </span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user?.name || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {getUserRoleDisplay()} Account
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {user?.email}
                                            </div>
                                        </div>

                                        {/* Profile Link */}
                                        <Link
                                            to={getProfileRoute()}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            My Profile
                                        </Link>

                                        {/* Buyer Specific Links */}
                                        {isBuyer() && (
                                            <>
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/order-details"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Order Details
                                                </Link>
                                            </>
                                        )}

                                        {/* Seller Specific Links */}
                                        {isSeller() && (
                                            <>
                                                <Link
                                                    to="/farmer/products"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    My Products
                                                </Link>
                                                <Link
                                                    to="/farmer/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    Seller Dashboard
                                                </Link>
                                                <Link
                                                    to="/farmer/orders"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Order Management
                                                </Link>
                                                <Link
                                                    to="/analytics"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    Analytics
                                                </Link>
                                            </>
                                        )}

                                        {/* Admin Specific Links */}
                                        {canAccessAdmin() && (
                                            <>
                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <div className="px-4 py-1 text-xs text-gray-500 font-medium">
                                                        Admin Tools
                                                    </div>
                                                </div>
                                                <Link
                                                    to="/admin/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Admin Dashboard
                                                </Link>
                                                <Link
                                                    to="/admin/dashboard/users"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Manage Users
                                                </Link>
                                                <Link
                                                    to="/admin/dashboard/products"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    Manage Products
                                                </Link>
                                                <Link
                                                    to="/admin/dashboard/orders"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Manage Orders
                                                </Link>
                                            </>
                                        )}

                                        {/* Common Dashboard */}
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2 pt-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                                >
                                    Login
                                </Link>

                                {/* Sign Up Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                                    >
                                        Sign Up
                                        <svg
                                            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <button
                                                onClick={() => handleSignupNavigation('buyer')}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                                            >
                                                Sign Up as Buyer
                                            </button>
                                            <button
                                                onClick={() => handleSignupNavigation('seller')}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                                            >
                                                Sign Up as Seller
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-2">
                        {/* Cart Icon for Mobile - Show for buyers and non-authenticated users */}
                        {(isBuyer() || !isAuthenticated) && (
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                                onClick={closeAllMenus}
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-4 px-4">
                            <Link
                                to="/"
                                className={`py-2 px-3 rounded-md transition-colors ${location.pathname === '/'
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                                onClick={closeAllMenus}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/products')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                                onClick={closeAllMenus}
                            >
                                Products
                            </Link>
                            <Link
                                to="/weather"
                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/weather')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                                onClick={closeAllMenus}
                            >
                                Weather
                            </Link>
                            <Link
                                to="/liveMarket"
                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/liveMarket')
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                                onClick={closeAllMenus}
                            >
                                LiveMarket
                            </Link>

                            {isAuthenticated && (
                                <Link
                                    to="/dashboard"
                                    className={`py-2 px-3 rounded-md transition-colors flex items-center ${isActiveRoute('/dashboard')
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                        }`}
                                    onClick={closeAllMenus}
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <>
                                    {canAccessAdmin() && (
                                        <Link
                                            to="/admin/dashboard"
                                            className={`py-2 px-3 rounded-md transition-colors flex items-center ${isActiveRoute('/admin')
                                                ? 'text-green-600 bg-green-50'
                                                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                }`}
                                            onClick={closeAllMenus}
                                        >
                                            <Shield className="w-4 h-4 mr-2" />
                                            Admin Panel
                                        </Link>
                                    )}

                                    <Link
                                        to={getProfileRoute()}
                                        className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute(getProfileRoute())
                                            ? 'text-green-600 bg-green-50'
                                            : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                            }`}
                                        onClick={closeAllMenus}
                                    >
                                        My Profile
                                    </Link>

                                    {isBuyer() && (
                                        <>
                                            <Link
                                                to="/orders"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/orders')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/order-details"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/order-details')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                Order Details
                                            </Link>
                                        </>
                                    )}

                                    {isSeller() && (
                                        <>
                                            <Link
                                                to="/farmer/products"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/farmer/products')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                My Products
                                            </Link>
                                            <Link
                                                to="/farmer/dashboard"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/seller-dashboard')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                Seller Dashboard
                                            </Link>
                                            <Link
                                                to="/farmer/orders"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/farmer/orders')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                Order Management
                                            </Link>
                                            <Link
                                                to="/analytics"
                                                className={`py-2 px-3 rounded-md transition-colors ${isActiveRoute('/analytics')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                Analytics
                                            </Link>
                                        </>
                                    )}

                                    {canAccessAdmin() && (
                                        <>
                                            <Link
                                                to="/admin/dashboard/users"
                                                className={`py-2 px-3 rounded-md transition-colors flex items-center ${isActiveRoute('/admin/dashboard/users')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                <Users className="w-4 h-4 mr-2" />
                                                Manage Users
                                            </Link>
                                            <Link
                                                to="/admin/dashboard/products"
                                                className={`py-2 px-3 rounded-md transition-colors flex items-center ${isActiveRoute('/admin/dashboard/products')
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={closeAllMenus}
                                            >
                                                <Package className="w-4 h-4 mr-2" />
                                                Manage Products
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-center font-medium"
                                        onClick={closeAllMenus}
                                    >
                                        Login
                                    </Link>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => handleSignupNavigation('buyer')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                                        >
                                            Sign Up as Buyer
                                        </button>
                                        <button
                                            onClick={() => handleSignupNavigation('seller')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center font-medium"
                                        >
                                            Sign Up as Seller
                                        </button>
                                    </div>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeAllMenus}
                />
            )}
        </header>
    );
};

export default Header;