import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">D</span>
                            </div>
                            <span className="text-xl font-bold">DOKO</span>
                        </div>
                        <p className="text-gray-400">
                            Nepal's smart agro-based marketplace connecting farmers directly with buyers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* For Farmers */}
                    <div>
                        <h3 className="font-semibold mb-4">For Farmers</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/signup?type=farmer" className="hover:text-white transition-colors">Sell on DOKO</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">Farmer Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@doko.com</li>
                            <li>Phone: +977 9841000000</li>
                            <li>Address: Hattisar, Dharan, Nepal</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 DOKO Agro Marketplace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;