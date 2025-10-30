import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { Package, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';

const Orders = () => {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await orderService.updateOrderStatus(orderId, { status: 'Cancelled' });
            // Refresh orders list
            fetchOrders();
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError('Failed to cancel order');
        }
    };
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMyOrders();
            setOrders(response.orders || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Dispatched':
            case 'Confirmed':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Dispatched':
            case 'Confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `NPR ${price?.toFixed(2) || '0.00'}`;
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">Please log in to view your orders</p>
                        <Link
                            to="/login"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                        >
                            Login to Continue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-gray-600">Loading your orders...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">View and manage your orders</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Orders
                        </button>
                        <button
                            onClick={() => setFilter('Created')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Created'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('Dispatched')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Dispatched'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Dispatched
                        </button>
                        <button
                            onClick={() => setFilter('Delivered')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Delivered'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Delivered
                        </button>
                        <button
                            onClick={() => setFilter('Cancelled')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Cancelled'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {filter === 'all' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'all'
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${filter.toLowerCase()} orders.`
                                }
                            </p>
                            {filter === 'all' && (
                                <Link
                                    to="/products"
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                                >
                                    Start Shopping
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Order Header */}
                                <div className="border-b border-gray-200 p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                            {getStatusIcon(order.status)}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.orderId || order._id.slice(-8).toUpperCase()}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {formatPrice(order.totals?.grandTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    {item.product?.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(item.unitPrice * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="mb-4 sm:mb-0">
                                            <p className="text-sm text-gray-600">
                                                <strong>Payment:</strong> {order.payment?.method} •
                                                <span className={`ml-1 ${order.payment?.status === 'Paid'
                                                    ? 'text-green-600'
                                                    : 'text-yellow-600'
                                                    }`}>
                                                    {order.payment?.status}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                <strong>Shipping to:</strong> {order.shippingAddress?.name}
                                            </p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <Link
                                                to={`/order-details/${order._id}`}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                View Details
                                            </Link>
                                            {order.status === 'Created' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;