import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import ProductManagement from './pages/farmer/ProductManagement';
import OrderManagement from './pages/farmer/OrderManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              {/* Fix: Add * for nested routes */}
              <Route path="/farmer/dashboard/*" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
              {/* Other protected routes */}
              <Route path="/orders" element={<ProtectedRoute><div>Orders Page</div></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><div>Profile Page</div></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/farmer/products" element={<ProtectedRoute><ProductManagement/></ProtectedRoute>} />
              <Route path="/farmer/orders" element={<ProtectedRoute><OrderManagement/></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider >
  );
}

export default App;