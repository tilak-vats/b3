import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCart, CartItem } from '@/hooks/useCart';
import { useProducts, Product } from '@/hooks/useProducts';
import Header from '@/components/Header';

const Cart = () => {
  const { getCartItems, removeFromCart, updateCartItemQuantity, clearCart, isLoading } = useCart();
  const { products } = useProducts();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartProducts, setCartProducts] = useState<(Product & { cartQuantity: number })[]>([]);
  
  // Form states
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'takeaway'>('delivery');
  const [paymentOption, setPaymentOption] = useState<'online' | 'cod'>('online');

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      const productsWithCart = cartItems
        .map(cartItem => {
          const product = products.find(p => p.barcode === cartItem.barcode);
          return product ? { ...product, cartQuantity: cartItem.quantity } : null;
        })
        .filter(Boolean) as (Product & { cartQuantity: number })[];
      
      setCartProducts(productsWithCart);
    } else {
      setCartProducts([]);
    }
  }, [cartItems, products]);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const handleRemoveItem = async (barcode: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromCart(barcode);
              await loadCartItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove item from cart');
            }
          },
        },
      ]
    );
  };

  const handleUpdateQuantity = async (barcode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(barcode);
      return;
    }

    try {
      await updateCartItemQuantity(barcode, newQuantity);
      await loadCartItems();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCart();
              await loadCartItems();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
            }
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const handleCheckout = () => {
    if (!address.trim() && deliveryOption === 'delivery') {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const orderDetails = {
      items: cartProducts,
      total: calculateTotal(),
      deliveryOption,
      paymentOption,
      address: deliveryOption === 'delivery' ? address : 'Store Pickup',
      phoneNumber,
    };

    Alert.alert(
      'Order Confirmation',
      `Order Type: ${deliveryOption === 'delivery' ? 'Home Delivery' : 'Pre-order & Takeaway'}\nPayment: ${paymentOption === 'online' ? 'Online Payment' : 'Cash on ' + (deliveryOption === 'delivery' ? 'Delivery' : 'Pickup')}\nTotal: ₹${calculateTotal().toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Order', onPress: () => Alert.alert('Success', 'Order placed successfully!') }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: Product & { cartQuantity: number } }) => (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 mx-4 mb-3 p-4">
      <View className="flex-row">
        <View className="w-16 h-16 bg-gray-100 rounded-lg mr-3 overflow-hidden">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Feather name="image" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>
        
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-1 capitalize">
            {item.category}
          </Text>
          <Text className="text-lg font-bold text-purple-600">
            ₹{item.price}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.barcode)}
          className="p-2"
        >
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.barcode, item.cartQuantity - 1)}
            className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
          >
            <Feather name="minus" size={14} color="#374151" />
          </TouchableOpacity>
          <Text className="mx-4 text-base font-semibold">
            {item.cartQuantity}
          </Text>
          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.barcode, item.cartQuantity + 1)}
            className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
          >
            <Feather name="plus" size={14} color="#374151" />
          </TouchableOpacity>
        </View>
        <Text className="text-base font-bold text-gray-800">
          ₹{(item.price * item.cartQuantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title="Shopping Cart" showProfile={false} />
      
      {cartProducts.length > 0 ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Cart Items Header */}
          <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <Text className="text-gray-600 font-medium">
              {cartProducts.length} item{cartProducts.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              onPress={handleClearCart}
              className="flex-row items-center px-3 py-2 bg-red-50 rounded-lg"
            >
              <Feather name="trash-2" size={14} color="#EF4444" />
              <Text className="ml-2 text-red-600 font-medium text-sm">Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <FlatList
            data={cartProducts}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingTop: 12 }}
            scrollEnabled={false}
          />

          {/* Order Details Form */}
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Order Details</Text>
            
            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number *</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              />
            </View>

            {/* Delivery Options */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">Delivery Option</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setDeliveryOption('delivery')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    deliveryOption === 'delivery' ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Feather name="truck" size={16} color={deliveryOption === 'delivery' ? '#8B5CF6' : '#6B7280'} />
                  <Text className={`ml-2 font-medium ${deliveryOption === 'delivery' ? 'text-purple-600' : 'text-gray-600'}`}>
                    Home Delivery
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setDeliveryOption('takeaway')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    deliveryOption === 'takeaway' ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Feather name="shopping-bag" size={16} color={deliveryOption === 'takeaway' ? '#8B5CF6' : '#6B7280'} />
                  <Text className={`ml-2 font-medium ${deliveryOption === 'takeaway' ? 'text-purple-600' : 'text-gray-600'}`}>
                    Takeaway
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address (only for delivery) */}
            {deliveryOption === 'delivery' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Delivery Address *</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your complete address"
                  multiline
                  numberOfLines={3}
                  className="border border-gray-200 rounded-lg px-3 py-3 text-base"
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Payment Options */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">Payment Method</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setPaymentOption('online')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    paymentOption === 'online' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Feather name="credit-card" size={16} color={paymentOption === 'online' ? '#10B981' : '#6B7280'} />
                  <Text className={`ml-2 font-medium ${paymentOption === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                    Online Payment
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setPaymentOption('cod')}
                  className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border ${
                    paymentOption === 'cod' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Feather name="dollar-sign" size={16} color={paymentOption === 'cod' ? '#10B981' : '#6B7280'} />
                  <Text className={`ml-2 font-medium ${paymentOption === 'cod' ? 'text-green-600' : 'text-gray-600'}`}>
                    Cash on {deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-white mx-4 mt-4 mb-6 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Order Summary</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-semibold">₹{calculateTotal().toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="font-semibold">
                {deliveryOption === 'delivery' ? '₹50.00' : '₹0.00'}
              </Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">Total</Text>
                <Text className="text-xl font-bold text-purple-600">
                  ₹{(calculateTotal() + (deliveryOption === 'delivery' ? 50 : 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Checkout Button */}
          <View className="px-4 pb-6">
            <TouchableOpacity
              onPress={handleCheckout}
              className="bg-purple-500 rounded-xl py-4 items-center shadow-sm"
            >
              <Text className="text-white text-lg font-bold">
                Place Order - ₹{(calculateTotal() + (deliveryOption === 'delivery' ? 50 : 0)).toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Feather name="shopping-cart" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            Your cart is empty
          </Text>
          <Text className="text-gray-400 mt-2 text-center px-8">
            Add some products to get started with your order
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;