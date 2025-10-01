import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusFilters = [
    { id: 'all', label: 'All Orders', color: 'gray' },
    { id: 'Created', label: 'New Orders', color: 'blue' },
    { id: 'Confirmed', label: 'Confirmed', color: 'green' },
    { id: 'Dispatched', label: 'Dispatched', color: 'yellow' },
    { id: 'Delivered', label: 'Delivered', color: 'purple' },
    { id: 'Cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getFarmerOrders({
        status: activeFilter === 'all' ? undefined : activeFilter
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Created: 'bg-blue-100 text-blue-800 border-blue-200',
      Confirmed: 'bg-green-100 text-green-800 border-green-200',
      Dispatched: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Delivered: 'bg-purple-100 text-purple-800 border-purple-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getNextStatusAction = (currentStatus) => {
    const actions = {
      Created: { label: 'Confirm Order', status: 'Confirmed', color: 'green' },
      Confirmed: { label: 'Mark as Dispatched', status: 'Dispatched', color: 'yellow' },
      Dispatched: { label: 'Mark as Delivered', status: 'Delivered', color: 'purple' }
    };
    return actions[currentStatus];
  };

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track your customer orders</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{orders.length}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-green-100/50">
        <div className="flex space-x-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${activeFilter === filter.id
                  ? `bg-${filter.color}-500 text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {filter.label}
              {filter.id !== 'all' && (
                <span className={`ml-2 ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
                  } py-0.5 px-2 rounded-full text-xs`}>
                  {orders.filter(o => o.status === filter.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-green-100/50">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter.toLowerCase()} orders`}
          </h3>
          <p className="text-gray-600">
            {activeFilter === 'all'
              ? 'Orders will appear here as customers place them'
              : `No orders with status "${activeFilter}" found`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const nextAction = getNextStatusAction(order.status);

            return (
              <div key={order._id} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">
                    👤 {order.user?.name || 'Customer'}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {order.shippingAddress?.address || 'Address not provided'}
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 {order.shippingAddress?.phone || 'Phone not provided'}
                  </p>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit} × ₹{item.unitPrice}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ₹{item.quantity * item.unitPrice}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{order.totals?.grandTotal || 0}
                  </span>
                </div>

                {/* Payment Info */}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Payment Method: {order.payment?.method}</span>
                  <span className={`font-medium ${order.payment?.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                    {order.payment?.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {nextAction && (
                    <button
                      onClick={() => updateOrderStatus(order._id, nextAction.status)}
                      className={`flex-1 bg-${nextAction.color}-500 text-white py-3 rounded-xl font-semibold hover:bg-${nextAction.color}-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105`}
                    >
                      {nextAction.label}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Detailed order information can go here */}
            <div className="space-y-4">
              <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(selectedOrder, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;