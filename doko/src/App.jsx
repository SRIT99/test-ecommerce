import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import ProductCard from './components/ProductCard';
import FarmerCard from './components/FarmerCard';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './pages/Layout'; // <-- Correct import
import HomePage from './pages/Home';
import MerchantPage from './pages/MerchantPage';
import TransportMerchantForm from './components/TransportMerchantForm';
import MerchantDashboard from './pages/MerchantDashboard';
import FarmerPage from './pages/FarmerPage';
import ContactPage from './pages/ContactPage';
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <DashboardPage currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/merchant-dashboard"
          element={
            <ProtectedRoute user={currentUser} role="merchant">
              <MerchantDashboard merchant={currentUser} />
            </ProtectedRoute>
          }
        />
  <Route path="/farmers" element={<FarmerPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/merchant" element={<MerchantPage />} />
  <Route path="/merchant/apply" element={<TransportMerchantForm />} />
  <Route path="/product/:id" element={<ProductCard />} />
  <Route path='/farmer/:id' element={< FarmerCard />}/>

        <Route
          path="*"
          element={
            <div className="container mx-auto px-4 py-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">404 - Page Not Found</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">This page doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
