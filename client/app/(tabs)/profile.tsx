import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import Header from '@/components/Header';
import OrderHistoryCard from '@/components/OrderHistoryCard';
import CoinsDisplay from '@/components/CoinsDisplay';
import { useOrders } from '@/hooks/useOrders';
import { useUser } from '@/hooks/useUser';

const Profile = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const { userData, fetchUserData } = useUser();
  const { orders, isLoading: ordersLoading, fetchOrders } = useOrders();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (activeTab === 'orders') {
        await fetchOrders();
      } else {
        await fetchUserData();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  const profileOptions = [
    {
      icon: 'user',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!'),
    },
    {
      icon: 'heart',
      title: 'Wishlist',
      subtitle: 'Your saved items',
      onPress: () => Alert.alert('Coming Soon', 'Wishlist feature will be available soon!'),
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon!'),
    },
    {
      icon: 'info',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('About B3 Store', 'Version 1.0.0\nBuilt with React Native & Expo'),
    },
  ];

  const renderProfileContent = () => (
    <ScrollView 
      className="flex-1" 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-6">
        <View className="items-center">
          <View className="relative">
            <Image
              source={{ 
                uri: clerkUser?.imageUrl || 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=U'
              }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-4">
            {clerkUser?.fullName || 'User'}
          </Text>
          <Text className="text-gray-500 mt-1">
            {clerkUser?.primaryEmailAddress?.emailAddress}
          </Text>
          
          {/* Coins Display */}
          <View className="mt-4">
            <CoinsDisplay 
              coins={userData?.coins || 0} 
              size="large" 
              showLabel={true} 
            />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Earn 1 coin for every ₹100 spent
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Options */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={option.title}
            onPress={option.onPress}
            className={`flex-row items-center p-4 ${
              index !== profileOptions.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center mr-4">
              <Feather name={option.icon as any} size={18} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {option.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {option.subtitle}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        disabled={isLoading}
        className="bg-white mx-4 mt-4 mb-8 rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <View className="flex-row items-center justify-center">
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text className="ml-3 text-base font-semibold text-red-500">
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderOrdersContent = () => (
    <ScrollView 
      className="flex-1" 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-4">
        {ordersLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Feather name="clock" size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">
              Loading your orders...
            </Text>
          </View>
        ) : orders.length > 0 ? (
          <>
            <Text className="text-sm text-gray-600 mb-4">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </Text>
            {orders.map((order) => (
              <OrderHistoryCard key={order._id} order={order} />
            ))}
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Feather name="shopping-bag" size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">
              No orders yet
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              Your order history will appear here once you place your first order
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title="Profile" showProfile={false} />
      
      {/* Tab Bar */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row px-4 py-2">
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === 'profile'
                ? 'border-purple-500'
                : 'border-transparent'
            }`}
          >
            <View className="flex-row items-center">
              <Feather 
                name="user" 
                size={16} 
                color={activeTab === 'profile' ? '#8B5CF6' : '#6B7280'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'profile'
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                Profile
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === 'orders'
                ? 'border-purple-500'
                : 'border-transparent'
            }`}
          >
            <View className="flex-row items-center">
              <Feather 
                name="shopping-bag" 
                size={16} 
                color={activeTab === 'orders' ? '#8B5CF6' : '#6B7280'} 
              />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'orders'
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                Order History
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'profile' ? renderProfileContent() : renderOrdersContent()}
    </SafeAreaView>
  );
};

export default Profile;