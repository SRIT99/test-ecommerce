import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext'; // Add cart context
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'; // Added icons

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartItemsCount } = useCart(); // Cart functionality
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
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
                        <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-green-600 transition-colors">
                            Products
                        </Link>
                        <Link to="/farmers" className="text-gray-700 hover:text-green-600 transition-colors">
                            Farmers
                        </Link>
                        {isAuthenticated && user?.userType === 'seller' && (
                            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                                Dashboard
                            </Link>
                        )}
                        {isAuthenticated && (user?.userType === 'admin' || user?.userType === 'superadmin') && (
                            <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                                Admin Panel
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart Icon - Always visible */}
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

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{user?.name}</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        {user?.userType === 'seller' && (
                                            <Link
                                                to="/farmer/dashboard"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Farmer Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-2">
                        {/* Cart Icon for Mobile */}
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
                                className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                onClick={closeAllMenus}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                onClick={closeAllMenus}
                            >
                                Products
                            </Link>
                            <Link
                                to="/farmers"
                                className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                onClick={closeAllMenus}
                            >
                                Farmers
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {user?.userType === 'seller' && (
                                        <Link
                                            to="/dashboard"
                                            className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                            onClick={closeAllMenus}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    {user?.userType === 'seller' && (
                                        <Link
                                            to="/farmer/dashboard"
                                            className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                            onClick={closeAllMenus}
                                        >
                                            Farmer Dashboard
                                        </Link>
                                    )}
                                    {(user?.userType === 'admin' || user?.userType === 'superadmin') && (
                                        <Link
                                            to="/admin"
                                            className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                            onClick={closeAllMenus}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                        onClick={closeAllMenus}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="text-gray-700 hover:text-green-600 transition-colors py-2"
                                        onClick={closeAllMenus}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left text-gray-700 hover:text-green-600 transition-colors py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-center"
                                        onClick={closeAllMenus}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                                        onClick={closeAllMenus}
                                    >
                                        Sign Up
                                    </Link>
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