import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts(filters);
        
        // Ensure we always have an array, even if API returns different structure
        let productsArray = [];
        
        if (Array.isArray(response)) {
          productsArray = response;
        } else if (response && Array.isArray(response.products)) {
          productsArray = response.products;
        } else if (response && Array.isArray(response.data)) {
          productsArray = response.data;
        }
        
        setProducts(productsArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.error || 'Failed to fetch products');
        setProducts([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filtersString]);

  return { products, loading, error };
};