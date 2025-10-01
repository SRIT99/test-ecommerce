import api from './api';

export const adminService = {
  // User Management
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async verifyUser(userId) {
    const response = await api.patch(`/users/${userId}/verify`);
    return response.data;
  },

  // Price Management
  async syncPrices() {
    const response = await api.post('/admin/sync-prices');
    return response.data;
  },

  // Product Management
  async getAllProducts() {
    const response = await api.get('/products?all=true');
    return response.data;
  },

  async toggleProductStatus(productId, isActive) {
    const response = await api.patch(`/products/${productId}`, { isActive });
    return response.data;
  },

  // Order Management
  async getAllOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Vehicle Management
  async getVehicles() {
    const response = await api.get('/vehicles');
    return response.data;
  },

  async createVehicle(vehicleData) {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  }
};