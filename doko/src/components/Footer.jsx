import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const FooterLinks = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];


const Footer = () => {
    return (
        <div className="bg-slate-800 dark:bg-slate-950 text-white mt-12 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">DOKO</h3>
                        <p className="text-slate-400 mb-4">Smart Agro-based Marketplace connecting farmers directly with buyers throughout Nepal.</p>
                        <div className="flex space-x-4">
         

                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-slate-400 hover:text-primary transition-colors">Home</a></li>
                            <li><a href="/products" className="text-slate-400 hover:text-primary transition-colors">Products</a></li>
                            <li><a href="/farmers" className="text-slate-400 hover:text-primary transition-colors">Farmers</a></li>
                            <li><a href="/buyers" className="text-slate-400 hover:text-primary transition-colors">Buyers</a></li>
                            <li><a href="/about" className="text-slate-400 hover:text-primary transition-colors">About</a></li>
                            <li><a href="/contact" className="text-slate-400 hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">FAQs</a></li>
                            <li><a href="/contact" className="text-slate-400 hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li className="flex items-start">
                                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary"></i>
                                <span>Central Campus of Technology, Dharan</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-phone mr-3 text-primary"></i>
                                <span>+977 9815186669</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-envelope mr-3 text-primary"></i>
                                <span>info@doko.com.np</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-500">
                    <p>&copy; 2025 DOKO - Smart Agro Marketplace. All rights reserved.</p>
                </div>
            </div>
        </div >


    );
};

export default Footer;