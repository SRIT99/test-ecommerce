import api from './api';

export const productService = {
  async getProducts(filters = {}) {
    try {
      // Only use search endpoint if we have active filters
      if (filters.search || filters.category || filters.sort !== 'name') {
        const params = {
          search: filters.search || '',
          category: filters.category || '',
          sortBy: this.getSortField(filters.sort),
          sortOrder: this.getSortOrder(filters.sort),
          page: 1,
          limit: 100
        };

        const response = await api.get('/products/search', { params });
        return response.data.products; // Extract products from search response
      } else {
        // No filters, use basic listing
        const response = await api.get('/products');
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getSortField(sort) {
    switch (sort) {
      case 'name': return 'name';
      case 'price': return 'price';
      case '-price': return 'price';
      case 'createdAt': return 'createdAt';
      default: return 'createdAt';
    }
  },

  getSortOrder(sort) {
    switch (sort) {
      case '-price': return 'desc';
      default: return 'asc';
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      console.log('Creating product:', productData);
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // In productService.js - add error handling
async uploadProductImage(formData) {
  try {
    const response = await api.post('/products/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout for large files
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading product image:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Image upload timeout - file may be too large');
    }
    throw error;
  }
}
};