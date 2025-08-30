import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ currentUser, setCurrentUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Farmers', path: '/farmers' },
    { name: 'Buyers', path: '/buyers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Logo Row */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary dark:text-primary-light">
              <img
                src={logo}
                alt="DOKO Logo"
                className="h-12 w-12 object-contain mr-2"
              />
              <h1
                className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text "
              >
                DOKO
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <option>English</option>
              <option>नेपाली</option>
            </select>
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-slate-700"></i>
              )}
            </button>
          </div>
        </div>

        {/* Nav and Right Section Row */}
        <div className="flex justify-between items-center py-2">
          {/* Desktop Nav and Right Section */}
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            {/* Left: Nav Links */}
            <nav>
              <ul className="flex flex-row space-x-6">
                {navLinks.map(({ name, path }) => (
                  <li key={name}>
                    <Link
                      to={path}
                      className={`block py-2 px-2 rounded transition-colors ${location.pathname === path
                        ? 'text-primary dark:text-primary-light bg-slate-100 dark:bg-slate-700'
                        : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
                      }`}
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
                        ? 'text-primary dark:text-primary-light bg-slate-100 dark:bg-slate-700'
                        : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Right: Auth & Language */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <>
                  <span className="text-slate-700 dark:text-slate-300 mr-2">
                    Welcome, {currentUser.name}
                  </span>
                  <button
                    className="px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary dark:hover:bg-primary-light hover:text-white transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary dark:hover:bg-primary-light hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-orange-500 dark:bg-primary-light text-white rounded hover:bg-orange-600 dark:hover:bg-dark transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile: Hamburger & Dark Mode */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              className="text-slate-700 dark:text-slate-300"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav
          className={`${mobileMenuOpen ? 'block' : 'hidden'
            } md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-800 shadow-md py-4 transition-all duration-300 z-40`}
        >
          <ul className="flex flex-col space-y-2">
            {navLinks.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={`block py-2 px-4 rounded transition-colors ${location.pathname === path
                    ? 'text-primary dark:text-primary-light bg-slate-100 dark:bg-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
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
                  className={`block py-2 px-4 rounded transition-colors ${location.pathname === '/dashboard'
                    ? 'text-primary dark:text-primary-light bg-slate-100 dark:bg-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="flex items-center space-x-2 mt-2">
              {currentUser ? (
                <button
                  className="flex-1 px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary dark:hover:bg-primary-light hover:text-white transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary dark:hover:bg-primary-light hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 bg-orange-500 dark:bg-primary-light text-white rounded hover:bg-orange-600 dark:hover:bg-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <select className="ml-2 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <option>English</option>
                <option>नेपाली</option>
              </select>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
