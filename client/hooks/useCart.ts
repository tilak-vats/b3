import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';

const CART_STORAGE_KEY = 'cart_items';
const API_BASE_URL = 'https://b3-iot.vercel.app';

export interface CartItem {
  barcode: string;
  quantity: number;
  addedAt: string;
}

export const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const getCartItems = async (): Promise<CartItem[]> => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  };

  const addToCart = async (barcode: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const currentCart = await getCartItems();
      const existingItemIndex = currentCart.findIndex(item => item.barcode === barcode);

      let updatedCart: CartItem[];
      if (existingItemIndex >= 0) {
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          barcode,
          quantity,
          addedAt: new Date().toISOString(),
        };
        updatedCart = [...currentCart, newItem];
      }

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      
      // Sync with backend in background
      syncCartWithBackend(updatedCart);
      
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (barcode: string) => {
    setIsLoading(true);
    try {
      const currentCart = await getCartItems();
      const updatedCart = currentCart.filter(item => item.barcode !== barcode);
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      
      // Sync with backend in background
      syncCartWithBackend(updatedCart);
      
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (barcode: string, quantity: number) => {
    setIsLoading(true);
    try {
      const currentCart = await getCartItems();
      const updatedCart = currentCart.map(item =>
        item.barcode === barcode ? { ...item, quantity } : item
      );
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      
      // Sync with backend in background
      syncCartWithBackend(updatedCart);
      
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      
      // Sync with backend in background
      syncCartWithBackend([]);
      
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncCartWithBackend = async (cartItems: CartItem[]) => {
    try {
      const token = await getToken();
      if (!token) return;

      // Get user email from token or user profile
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { user } = await response.json();
        
        // Update cart in backend
        await fetch(`${API_BASE_URL}/api/users/cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartItems: cartItems.map(item => ({ barcode: parseInt(item.barcode) })),
            email: user.email,
          }),
        });
      }
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
      // Don't throw error as this is background sync
    }
  };

  return {
    getCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    isLoading,
  };
};