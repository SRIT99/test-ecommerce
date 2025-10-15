// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { CreditCard, Truck, MapPin, User, Phone, Home } from 'lucide-react';

const Checkout = () => {
    const { items, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeStep, setActiveStep] = useState(1);

    // Form state
    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        region: '',
        postalCode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!shippingAddress.name.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 7) {
            setError('Please enter a valid phone number');
            return false;
        }
        if (!shippingAddress.address.trim()) {
            setError('Please enter your delivery address');
            return false;
        }
        if (!shippingAddress.city.trim()) {
            setError('Please enter your city');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Prepare order data for backend
            const orderData = {
                items: items.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    name: shippingAddress.name,
                    phone: shippingAddress.phone,
                    address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.region}`
                },
                paymentMethod: paymentMethod
            };

            // Call your backend order creation API
            const order = await orderService.createOrder(orderData);

            // Clear cart on successful order
            clearCart();

            // Redirect to order success page
            navigate(`/order-success/${order._id}`, {
                state: {
                    orderId: order._id,
                    paymentMethod: paymentMethod
                }
            });

        } catch (err) {
            console.error('Order creation error:', err);
            setError(err.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = getCartTotal();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">Please log in to proceed with checkout</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Login to Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Checkout Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your purchase</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center ${activeStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeStep >= 1 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                1
                            </div>
                            <span className="ml-2 font-medium">Shipping</span>
                        </div>

                        <div className="w-12 h-0.5 bg-gray-300"></div>

                        <div className={`flex items-center ${activeStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeStep >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                2
                            </div>
                            <span className="ml-2 font-medium">Payment</span>
                        </div>

                        <div className="w-12 h-0.5 bg-gray-300"></div>

                        <div className={`flex items-center ${activeStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeStep >= 3 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                                3
                            </div>
                            <span className="ml-2 font-medium">Confirm</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Truck className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={shippingAddress.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Address *
                                    </label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                        <textarea
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                            placeholder="Enter your complete delivery address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter your city"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Region
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={shippingAddress.region}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter your region"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <CreditCard className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="eSewa"
                                        checked={paymentMethod === 'eSewa'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">eSewa</span>
                                        <p className="text-sm text-gray-500">Pay securely with eSewa wallet</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Khalti"
                                        checked={paymentMethod === 'Khalti'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Khalti</span>
                                        <p className="text-sm text-gray-500">Pay securely with Khalti wallet</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.product._id} className="flex items-center space-x-3">
                                        <img
                                            src={item.product.imageUrl || '/api/placeholder/60/60'}
                                            alt={item.product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × NPR {item.product.price}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            NPR {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Totals */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>NPR {totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>NPR 0.00</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-green-600">NPR {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Placing Order...</span>
                                    </div>
                                ) : (
                                    `Place Order - NPR ${totalAmount.toFixed(2)}`
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full mt-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                            >
                                ← Back to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;