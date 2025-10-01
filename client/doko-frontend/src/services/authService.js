import api from './api';

export const authService = {
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

  getCurrentUser() {
    const user = localStorage.getItem('doko_user');
    return user ? JSON.parse(user) : null;
  },

  async getProfile() {
    try {
      const response = await api.get('/users/me');
      const userData = response.data;
      localStorage.setItem('doko_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};