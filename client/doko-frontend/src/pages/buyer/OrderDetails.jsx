import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowLeft,
    MapPin,
    CreditCard,
    User,
    Phone,
    Home
} from 'lucide-react';

const OrderDetails = () => {
    const { orderId } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && orderId) {
            fetchOrderDetails();
        }
    }, [orderId, isAuthenticated]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(orderId);
            setOrder(response.order);
        } catch (err) {
            console.error('Error fetching order details:', err);
            if (err.response?.status === 401) {
                setError('Please log in to view order details');
            } else if (err.response?.status === 403) {
                setError('You are not authorized to view this order');
            } else if (err.response?.status === 404) {
                setError('Order not found');
            } else {
                setError('Failed to load order details');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'Dispatched':
            case 'Confirmed':
                return <Truck className="w-6 h-6 text-blue-500" />;
            case 'Cancelled':
                return <XCircle className="w-6 h-6 text-red-500" />;
            default:
                return <Clock className="w-6 h-6 text-yellow-500" />;
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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'text-green-600';
            case 'Failed':
                return 'text-red-600';
            case 'Refunded':
                return 'text-orange-600';
            default:
                return 'text-yellow-600';
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
        if (!price) return 'NPR 0.00';
        return `NPR ${parseFloat(price).toFixed(2)}`;
    };

    const calculateItemTotal = (unitPrice, quantity) => {
        return (parseFloat(unitPrice) * parseInt(quantity)).toFixed(2);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">Please log in to view order details</p>
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
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600">Loading order details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/orders" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/orders" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg">
                        Order not found.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back button and header */}
                <div className="mb-6">
                    <Link to="/orders" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
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
                                    {order.updatedAt && order.updatedAt !== order.createdAt && (
                                        <p className="text-sm text-gray-500">
                                            Updated on {formatDate(order.updatedAt)}
                                        </p>
                                    )}
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
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                        <div className="space-y-4">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
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
                                                {item.name || 'Product'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                                            </p>
                                            {item.sellerId && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Seller ID: {item.sellerId.toString().slice(-8)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatPrice(calculateItemTotal(item.unitPrice, item.quantity))}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>No items found in this order</p>
                                </div>
                            )}
                        </div>

                        {/* Order Totals */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="space-y-2 max-w-xs ml-auto">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatPrice(order.totals?.subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-medium text-green-600">
                                        {order.totals?.shipping === 0 ? 'Free' : formatPrice(order.totals?.shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">NPR 0.00</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                                    <span>Total:</span>
                                    <span className="text-green-600">{formatPrice(order.totals?.grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping and Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                        </div>
                        {order.shippingAddress ? (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{order.shippingAddress.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{order.shippingAddress.phone}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Home className="w-4 h-4 text-gray-400 mt-1" />
                                    <span className="text-gray-700">{order.shippingAddress.address}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No shipping address provided</p>
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <CreditCard className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="font-medium text-gray-900">{order.payment?.method || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Status</p>
                                <p className={`font-medium ${getPaymentStatusColor(order.payment?.status)}`}>
                                    {order.payment?.status || 'Unknown'}
                                </p>
                            </div>
                            {order.payment?.pid && (
                                <div>
                                    <p className="text-sm text-gray-600">Payment ID</p>
                                    <p className="font-medium text-gray-900 text-sm">{order.payment.pid}</p>
                                </div>
                            )}
                            {order.payment?.referencedd && (
                                <div>
                                    <p className="text-sm text-gray-600">Transaction Reference</p>
                                    <p className="font-medium text-gray-900 text-sm">{order.payment.referencedd}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Order Created</p>
                                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                        {order.status === 'Confirmed' && (
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Confirmed</p>
                                    <p className="text-sm text-gray-500">Your order has been confirmed</p>
                                </div>
                            </div>
                        )}
                        {order.status === 'Dispatched' && (
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Dispatched</p>
                                    <p className="text-sm text-gray-500">Your order is on the way</p>
                                </div>
                            </div>
                        )}
                        {order.status === 'Delivered' && (
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Delivered</p>
                                    <p className="text-sm text-gray-500">Your order has been delivered</p>
                                </div>
                            </div>
                        )}
                        {order.status === 'Cancelled' && (
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Cancelled</p>
                                    <p className="text-sm text-gray-500">Your order has been cancelled</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <Link
                        to="/orders"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Back to Orders
                    </Link>
                    {order.status === 'Created' && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                    // Add cancel order functionality here
                                    console.log('Cancel order:', order._id);
                                }
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;