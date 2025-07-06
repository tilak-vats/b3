import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = 'https://b3-iota.vercel.app';

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  barcode: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const categorizeProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/products/categorize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to categorize products');
      }

      const data = await response.json();
      // Refresh products after categorization
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    categorizeProducts,
  };
};