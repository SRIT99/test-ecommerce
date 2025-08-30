import React, { useState, useEffect } from 'react';
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
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center text-primary dark:text-primary-light">
            <img
              src="data:image/svg+xml;base64,..."
              alt="DOKO Logo"
              className="h-10 mr-2"
            />
            <h1 className="text-xl font-bold">DOKO</h1>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-slate-700"></i>
              )}
            </button>

            <button
              className="md:hidden text-slate-700 dark:text-slate-300"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        <nav
          className={`${mobileMenuOpen ? 'block' : 'hidden'
            } md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-slate-800 md:bg-transparent shadow-md md:shadow-none py-4 md:py-0 transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6">
            {navLinks.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={`block py-2 px-4 md:px-2 md:py-1 rounded transition-colors ${location.pathname === path
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
                  className={`block py-2 px-4 md:px-2 md:py-1 rounded transition-colors ${location.pathname === '/dashboard'
                      ? 'text-primary dark:text-primary-light bg-slate-100 dark:bg-slate-700'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-2 mt-4 md:mt-0">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-slate-700 dark:text-slate-300">
                Welcome, {currentUser.name}
              </span>
              <button
                className="px-4 py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary dark:hover:bg-primary-light hover:text-white transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
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
                className="px-4 py-2 bg-primary dark:bg-primary-light text-white rounded hover:bg-dark dark:hover:bg-dark transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}

          <div className="ml-4">
            <select className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <option>English</option>
              <option>नेपाली</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
