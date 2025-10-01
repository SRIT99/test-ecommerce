import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export const useAdminData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        
        switch (endpoint) {
          case 'users':
            result = await adminService.getAllUsers();
            break;
          case 'products':
            result = await adminService.getAllProducts();
            break;
          case 'orders':
            result = await adminService.getAllOrders();
            break;
          case 'vehicles':
            result = await adminService.getVehicles();
            break;
          default:
            result = [];
        }

        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || `Failed to fetch ${endpoint}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};