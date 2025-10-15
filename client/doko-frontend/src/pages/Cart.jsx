// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                        <Link
                            to="/products"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                        >
                            <span>Continue Shopping</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            {items.map((item) => (
                                <div key={item.product._id} className="border-b last:border-b-0">
                                    <div className="p-6 flex items-center space-x-4">
                                        <img
                                            src={item.product.imageUrl || '/api/placeholder/100/100'}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-green-600 font-bold mb-1">
                                                NPR {item.product.price} / {item.product.unit}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Seller: {item.product.sellerName}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>

                                            <span className="w-12 text-center font-medium">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 mb-2">
                                                NPR {(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>NPR {getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>NPR 0.00</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-green-600">NPR {getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/products"
                                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center block"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;