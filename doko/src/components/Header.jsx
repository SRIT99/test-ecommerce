import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ currentUser, setCurrentUser, cartItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) setSearchQuery(savedQuery);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem('searchQuery', searchQuery.trim());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Farmers', path: '/farmers' },
    { name: 'Live Market', path: '/live-market' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="DOKO Logo" className="h-12 w-12 mr-2" />
            <h1 className="text-2xl font-extrabold text-green-700 dark:text-yellow-300">
              DOKO
            </h1>

          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="Search fresh produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary dark:bg-orange-600 text-white rounded-r-md hover:bg-dark dark:hover:bg-orange-700 transition-colors"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Cart + Auth */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-orange-400">
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {currentUser ? (
              <>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Hi, {currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-primary dark:border-orange-400 text-primary dark:text-orange-400 rounded hover:bg-primary dark:hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-primary dark:border-orange-400 text-primary dark:text-orange-400 rounded hover:bg-primary dark:hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Nav Row */}
        <div className="flex justify-between items-center py-2">
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`py-2 px-2 rounded transition-colors ${location.pathname === path
                  ? 'text-primary dark:text-orange-400 bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-orange-400'
                  }`}
              >
                {name}
              </Link>
            ))}
            {currentUser && (
              <Link
                to="/dashboard"
                className={`py-2 px-2 rounded transition-colors ${location.pathname === '/dashboard'
                  ? 'text-primary dark:text-orange-400 bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-orange-400'
                  }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-700 dark:text-slate-100"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {/* Mobile Nav */}
        <nav
          className={`${mobileMenuOpen ? 'block' : 'hidden'
            } md:hidden bg-white dark:bg-slate-900 shadow-md py-4 transition-all duration-300`}
        >
          <ul className="flex flex-col space-y-2 px-4">
            {navLinks.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={`block py-2 px-2 rounded transition-colors ${location.pathname === path
                    ? 'text-primary dark:text-orange-400 bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-orange-400'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {name}
                </Link>
              </li>
            ))}
            {currentUser && (
              <li>
                <Link
                  to="/dashboard"
                  className={`block py-2 px-2 rounded transition-colors ${location.pathname === '/dashboard'
                    ? 'text-primary dark:text-orange-400 bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-orange-400'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="mt-2">
              {currentUser ? (
                <button
                  className="w-full px-4 py-2 border border-primary dark:border-orange-400 text-primary dark:text-orange-400 rounded hover:bg-primary dark:hover:bg-orange-500 hover:text-white transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full px-4 py-2 border border-primary dark:border-orange-400 text-primary dark:text-orange-400 rounded hover:bg-primary dark:hover:bg-orange-500 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
