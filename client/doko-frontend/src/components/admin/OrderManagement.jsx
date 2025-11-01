// src/components/admin/OrderManagement.js
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import AdminSidebar from './AdminSidebar';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 10
    });
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    });

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📦 Fetching admin orders with filters:', filters);

            const data = await orderService.getAdminOrders(filters);
            console.log('✅ Admin orders API response:', data);

            const ordersList = data.orders || [];
            setOrders(ordersList);
            calculateStats(ordersList);
        } catch (error) {
            console.error('❌ Failed to fetch admin orders:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch orders');
            setOrders([]);
            setStats({ total: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (ordersList) => {
        const stats = {
            total: ordersList.length,
            pending: ordersList.filter(order => order.status === 'pending' || order.status === 'Created').length,
            confirmed: ordersList.filter(order => order.status === 'confirmed' || order.status === 'Confirmed').length,
            shipped: ordersList.filter(order => order.status === 'shipped' || order.status === 'Dispatched').length,
            delivered: ordersList.filter(order => order.status === 'delivered' || order.status === 'Delivered').length,
            cancelled: ordersList.filter(order => order.status === 'cancelled' || order.status === 'Cancelled').length
        };
        setStats(stats);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            console.log('🔄 Updating order status:', orderId, newStatus);
            await orderService.updateOrderStatusAdmin(orderId, { status: newStatus });
            alert(`Order status updated to ${newStatus} successfully!`);
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error('❌ Failed to update order status:', error);
            alert(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'Created': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'Confirmed': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'Dispatched': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'Delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'Created': 'Created',
            'confirmed': 'Confirmed',
            'Confirmed': 'Confirmed',
            'shipped': 'Shipped',
            'Dispatched': 'Dispatched',
            'delivered': 'Delivered',
            'Delivered': 'Delivered',
            'cancelled': 'Cancelled',
            'Cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    };

    const getStatusOptions = (currentStatus) => {
        const allStatuses = ['Created', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
        return allStatuses.filter(status => status !== currentStatus);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const OrderCard = ({ order }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">Order #{order._id?.substring(0, 8)}</h3>
                    <p className="text-gray-600 text-sm">
                        {order.user?.name || 'Unknown Buyer'} • {formatDate(order.createdAt)}
                    </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusDisplay(order.status)}
                </span>
            </div>

            {/* Order Items */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-2">
                    {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                                <span className="text-gray-700 font-medium">
                                    {item.name || item.product?.name || 'Unknown Product'}
                                </span>
                                <span className="text-gray-500 ml-2">× {item.quantity}</span>
                                <div className="text-xs text-gray-500">
                                    Seller: {item.sellerId?.name || 'Unknown Seller'}
                                </div>
                            </div>
                            <span className="text-gray-900 font-medium">
                                {formatPrice((item.unitPrice || item.price || 0) * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-semibold text-green-600">
                        {formatPrice(order.totals?.grandTotal || order.totalAmount || 0)}
                    </p>
                </div>
                <div>
                    <span className="text-gray-600">Payment:</span>
                    <p className="font-semibold">
                        {order.payment?.method || 'N/A'} -
                        <span className={order.payment?.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                            {order.payment?.status || 'Pending'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
                <div className="mb-4 text-sm">
                    <span className="text-gray-600">Shipping to:</span>
                    <p className="text-gray-900">
                        {order.shippingAddress.name}, {order.shippingAddress.phone}
                        <br />
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <select
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    defaultValue=""
                >
                    <option value="" disabled>Update Status</option>
                    {getStatusOptions(order.status).map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => handleViewDetails(order._id)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                    View Details
                </button>
            </div>
        </div>
    );

    const handleViewDetails = async (orderId) => {
        try {
            const orderDetails = await orderService.getOrderDetailsAdmin(orderId);
            // You can show this in a modal or navigate to details page
            console.log('Order details:', orderDetails);
            alert(`Order details loaded for ${orderId}. Check console for details.`);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            alert('Failed to load order details');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                                    <p className="text-gray-600">Manage all customer orders across the platform</p>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <strong>Error: </strong>{error}
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">📦</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Pending</p>
                                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">⏳</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Delivered</p>
                                            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">✅</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="Created">Created</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Dispatched">Dispatched</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by order ID or customer..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Results per page</label>
                                        <select
                                            value={filters.limit}
                                            onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchOrders}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                                                </div>
                                                <div className="h-6 bg-gray-300 rounded w-20"></div>
                                            </div>
                                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.length > 0 ? (
                                        orders.map(order => (
                                            <OrderCard key={order._id} order={order} />
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                                            <div className="text-6xl mb-4">📦</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                                            <p className="text-gray-600">
                                                {filters.status !== 'all' || filters.search
                                                    ? 'Try adjusting your search filters'
                                                    : 'Orders will appear here once customers start placing orders.'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;