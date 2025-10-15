// src/services/orderService.js
import api from './api';

export const orderService = {
  // ==================== BUYER ORDER METHODS ====================
  
  async createOrder(orderData) {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  async getMyOrders() {
    try {
      const response = await api.get('/api/orders/mine');
      return response.data;
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
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
  
  async initiatePayment(orderId, paymentMethod) {
    try {
      const response = await api.post(`/payments/${paymentMethod}/pay`, { orderId });
      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error);
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