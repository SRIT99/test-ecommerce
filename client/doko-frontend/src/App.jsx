import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Layout
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Weather from "./pages/weather";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentProcessing from "./pages/PaymentProcessing";
import OrderSuccess from "./pages/OrderSuccess";
import EsewaPayment from "./pages/payment/EsewaPayment";
import PaymentFailed from "./pages/payment/PaymentFailed";
import LiveMarketPrices from "./components/common/HeaderMarketPrices";

// Buyer pages
import Orders from "./pages/buyer/Orders";
import OrderDetails from "./pages/buyer/OrderDetails";
import BuyerProfile from "./components/profiles/BuyerProfile";

// Seller pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import ProductManagement from "./pages/farmer/ProductManagement";
import OrderManagement from "./pages/farmer/OrderManagement";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";

// Admin pages
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/profiles/AdminProfile";
// Import the missing admin components
import UsersManagement from "./components/admin/UserManagement";
import ProductsManagement from "./components/admin/ProductManagement";
import OrdersManagement from "./components/admin/OrderManagement";
import PriceSync from "./components/admin/PriceSync";
import VehicleManagement from "./components/admin/vehicleManagement";
import Analytics from "./components/admin/Analytics";

// Auth Middleware
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardOverview from "./pages/farmer/DashboardOverview";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
              <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/liveMarket" element={<LiveMarketPrices />} />

                {/* Buyer Routes */}
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <Orders />
                  </ProtectedRoute>}
                />
                <Route path="/order-details/:orderId" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <OrderDetails />
                  </ProtectedRoute>}
                />
                <Route path="/buyer-profile" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerProfile />
                  </ProtectedRoute>}
                />

                {/* Seller Routes */}
                <Route path="/farmer/dashboard" element={

                  <DashboardOverview />
                }
                />
                <Route path="/farmer/products" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <ProductManagement />
                  </ProtectedRoute>}
                />
                <Route path="/farmer/orders" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <OrderManagement />
                  </ProtectedRoute>}
                />
                <Route path="/seller-profile" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <FarmerProfile />
                  </ProtectedRoute>}
                />
                <Route path="/analytics" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <FarmerAnalytics />
                  </ProtectedRoute>}
                />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/users" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <UsersManagement />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/products" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <ProductsManagement />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/orders" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <OrdersManagement />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/prices" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <PriceSync />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/vehicles" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <VehicleManagement />
                  </ProtectedRoute>}
                />
                <Route path="/admin/dashboard/analytics" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <Analytics />
                  </ProtectedRoute>}
                />
                <Route path="/admin-profile" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminProfile />
                  </ProtectedRoute>}
                />

                {/* Common Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                {/* Checkout & Payment */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/payment/processing" element={<PaymentProcessing />} />
                <Route path="/payment/esewa" element={<ProtectedRoute><EsewaPayment /></ProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

                {/* 404 Fallback */}
                <Route path="*" element={<h2 className="text-center p-10">404 - Page Not Found</h2>} />

              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;