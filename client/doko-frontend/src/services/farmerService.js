import api from './api';

export const farmerService = {
  async getStats() {
    const response = await api.get('/farmer/stats');
    return response.data;
  },

  async getProducts(params = {}) {
    const response = await api.get('/farmer/products', { params });
    return response.data;
  },

  async getOrders(params = {}) {
    const response = await api.get('/farmer/orders', { params });
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/farmer/profile', profileData);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};