// src/services/adminService.js
import api from './api';

export const userService = {
  // Dashboard Stats
  // src/services/adminService.js
    getUsers: async (filters = {}) => {
        try {
            const response = await api.get('/admin/users', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    verifyUser: async (userId) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/verify`);
            return response.data;
        } catch (error) {
            console.error('Error verifying user:', error);
            throw error;
        }
    },

    suspendUser: async (userId) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/suspend`);
            return response.data;
        } catch (error) {
            console.error('Error suspending user:', error);
            throw error;
        }
    }
};

export const adminService = {
    verifyUser: async (userId) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/verify`);
            return response.data;
        } catch (error) {
            console.error('Error verifying user:', error);
            throw error;
        }
    },

    suspendUser: async (userId) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/suspend`);
            return response.data;
        } catch (error) {
            console.error('Error suspending user:', error);
            throw error;
        }
    },

  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getPlatformAnalytics() {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  // User Management
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async verifyUser(userId) {
    const response = await api.patch(`/users/${userId}/verify`);
    return response.data;
  },

  async verifyFarmer(userId) {
    const response = await api.patch(`/admin/users/${userId}/verify`);
    return response.data;
  },

  async suspendUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Price Management
  async syncPrices() {
    const response = await api.post('/admin/sync-prices');
    return response.data;
  },

  async getPriceHistory() {
    const response = await api.get('/admin/price-history');
    return response.data;
  },

  // Product Management
  async getAllProducts() {
    const response = await api.get('/products?all=true');
    return response.data;
  },

  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  async toggleProductStatus(productId, isActive) {
    const response = await api.patch(`/products/${productId}`, { isActive });
    return response.data;
  },

  async deleteProduct(productId) {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Order Management
  async getAllOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getOrderAnalytics() {
    const response = await api.get('/admin/orders/analytics');
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
  },

  async updateVehicle(vehicleId, vehicleData) {
    const response = await api.put(`/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  async deleteVehicle(vehicleId) {
    const response = await api.delete(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Platform Management
  async getSystemStatus() {
    const response = await api.get('/admin/system-status');
    return response.data;
  },

  async getRecentActivities() {
    const response = await api.get('/admin/activities');
    return response.data;
  },

  // Reports
  async generateReport(reportType, params = {}) {
    const response = await api.get(`/admin/reports/${reportType}`, { params });
    return response.data;
  },

  // Notifications
  async sendBroadcast(message, userType = 'all') {
    const response = await api.post('/admin/broadcast', { message, userType });
    return response.data;
  },
    getPlatformStats() {
        return api.get('/admin/stats');
    },
    
    getRecentActivities() {
        return api.get('/admin/activities');
    },
    
    getUsers(params = {}) {
        return api.get('/admin/users', { params });
    },
     getBuyerStats() {
        return api.get('/users/buyer/stats');
    },
    
    updatePreferences(preferences) {
        return api.put('/users/preferences', preferences);
    }
};
