import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = 'https://b3-iota.vercel.app';

export const useUserSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const syncUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync user');
      }

      const data = await response.json();
      console.log('User sync successful:', data.message);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync user';
      setError(errorMessage);
      console.error('User sync error:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    syncUser,
    isLoading,
    error,
  };
};