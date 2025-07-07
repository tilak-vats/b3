import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = 'https://b3-iota.vercel.app';

export interface UserData {
  _id: string;
  clerkId: string;
  email: string;
  profilePicture: string;
  coins: number;
  cartItem: Array<{ barcode: number }>;
  createdAt: string;
  updatedAt: string;
}

export const useUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data.user);
      return data.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(errorMessage);
      console.error('Fetch user data error:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    userData,
    isLoading,
    error,
    fetchUserData,
    refetch: fetchUserData,
  };
};