// src/services/authService.js

import api from './api';

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API response error:', error);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    console.error('❌ Error message:', error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  async signup(userData) {
    try {
      console.log('Attempting signup...', userData.email);
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.token) {
        localStorage.setItem('doko_token', response.data.token);
        localStorage.setItem('doko_user', JSON.stringify(response.data.user));
      }
      
      console.log('Signup successful');
      return response.data;
    } catch (error) {
      console.error('Signup service error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('doko_token');
    localStorage.removeItem('doko_user');
  },

 
 async login(credentials) {
    try {
      console.log('Attempting login...', credentials.email);
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('doko_token', response.data.token);
        localStorage.setItem('doko_user', JSON.stringify(response.data.user));
      }
      
      console.log('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, email, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      email,
      newPassword
    });
    return response.data;
  },

  async validateResetToken(token, email) {
    const response = await api.post('/auth/validate-reset-token', {
      token,
      email
    });
    return response.data;
  },

  // Test endpoint to verify connection
  async testConnection() {
    const response = await api.get('/health');
    return response.data;
  }
};