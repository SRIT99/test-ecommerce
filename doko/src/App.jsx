import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
            <Route path="/register" element={<RegisterPage setCurrentUser={setCurrentUser} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute currentUser={currentUser}>
                  <DashboardPage currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <div className="container mx-auto px-4 py-12 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">404 - Page Not Found</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400">This page doesn’t exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
