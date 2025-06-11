import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An API error occurred';
      setError(errorMessage);
      setData(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, callApi };
};
