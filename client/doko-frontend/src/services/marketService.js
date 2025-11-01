// src/services/marketService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('🚨 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const marketService = {
  // Get market prices with options
  async getMarketPrices(params = {}) {
    try {
      const response = await apiClient.get('/market/prices', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch market prices');
    }
  },

  // Get retail prices only
  async getRetailPrices(params = {}) {
    try {
      const response = await apiClient.get('/market/retail', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch retail prices');
    }
  },

  // Get wholesale prices only
  async getWholesalePrices(params = {}) {
    try {
      const response = await apiClient.get('/market/wholesale', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch wholesale prices');
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await apiClient.get('/market/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Search products
  async searchProducts(query, params = {}) {
    try {
      const response = await apiClient.get('/market/search', {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }
};