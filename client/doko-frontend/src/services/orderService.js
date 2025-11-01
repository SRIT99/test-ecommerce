// src/services/orderService.js
import api from './api';
const ENDPOINTS = {
  ADMIN_ORDERS: '/admin/orders',
  ORDERS: '/orders',
};
export const orderService = {

  // API endpoint constants


  // ==================== ADMIN ORDER MANAGEMENT ====================
  async getAdminOrders(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.ADMIN_ORDERS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  },

  async getOrderDetailsAdmin(orderId) {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN_ORDERS}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin order details:', error);
      throw error;
    }
  },

  async updateOrderStatusAdmin(orderId, statusData) {
    try {
      const response = await api.patch(`${ENDPOINTS.ADMIN_ORDERS}/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating order status (admin):', error);
      throw error;
    }
  },
  // ==================== BUYER ORDER METHODS ====================
  
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  async getMyOrders() {
    try {
      const response = await api.get('/orders/mine');
      return response.data;
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // ==================== FARMER ORDER METHODS ====================
  
  async getFarmerOrders(params = {}) {
    try {
      const response = await api.get('/farmer/orders', { params });
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching farmer orders:', error);
      throw error;
    }
  },

  async getFarmerAnalytics() {
    try {
      const response = await api.get('/farmer/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, statusData) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // ==================== PAYMENT METHODS ====================
  
// In OrderService.js
// In OrderService.js
async initiatePayment(orderId, paymentMethod) {
    try {
        console.log(`🔄 OrderService: Initiating ${paymentMethod} payment for order:`, orderId);
        
        const response = await api.post(`/payments/${paymentMethod}/pay`, { orderId });
        
        console.log(`✅ OrderService: ${paymentMethod} payment response:`, response.data);
        console.log(`🔍 Response structure:`, {
            hasPaymentData: !!response.data.paymentData,
            hasSuccess: !!response.data.success,
            keys: Object.keys(response.data)
        });
        
        return response.data;
    } catch (error) {
        console.error(`❌ OrderService: Error initiating ${paymentMethod} payment:`, error);
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
},

  async verifyPayment(paymentMethod, verificationData) {
    try {
      const response = await api.get(`/payments/${paymentMethod}/verify`, { 
        params: verificationData 
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
};