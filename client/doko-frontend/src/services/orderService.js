import api from './api';

export const orderService = {
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
  }
};