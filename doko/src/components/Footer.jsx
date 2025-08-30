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


const Footer = ({ setCurrentPage }) => {
    return (
        <div className="bg-slate-800 dark:bg-slate-950 text-white mt-12 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">DOKO</h3>
                        <p className="text-slate-400 mb-4">Smart Agro-based Marketplace connecting farmers directly with buyers throughout Nepal.</p>
                        <div className="flex space-x-4">
                             {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      key={link.title}
                    >
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                      key={link.title}
                    >
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* social links */}

            <div>
              <div className="flex items-center gap-3 mt-6">
                <a href="https://instagram.com/igsuraj.fx">
                  <FaInstagram className="text-3xl" />
                </a>
                <a href="https://facebook.com/surajrautdharan">
                  <FaFacebook className="text-3xl" />
                </a>
                <a href="https://linkedin.com/in/suraj-raut-5609a12b6">
                  <FaLinkedin className="text-3xl" />
                </a>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <FaMapLocationDot />
                  <p>Dharan, Koshi Pradesh</p>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <IoCall />
                  <p>+977 9815186669</p>
                </div>
              </div>
            </div>
          </div>
          {/* End of Footer Links */}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['home', 'products', 'farmers', 'buyers', 'about'].map((page) => (
                                <li key={page}>
                                    <a
                                        href="#"
                                        className="text-slate-400 hover:text-primary transition-colors"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page.charAt(0).toUpperCase() + page.slice(1)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {['Help Center', 'FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-400 hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
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