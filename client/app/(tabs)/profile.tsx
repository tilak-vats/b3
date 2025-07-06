import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import Header from '@/components/Header';

const Profile = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
      icon: 'shopping-bag',
      title: 'Order History',
      subtitle: 'View your past orders',
      onPress: () => Alert.alert('Coming Soon', 'Order history will be available soon!'),
    },
    {
      icon: 'heart',
      title: 'Wishlist',
      subtitle: 'Your saved items',
      onPress: () => Alert.alert('Coming Soon', 'Wishlist feature will be available soon!'),
    },
    {
      icon: 'credit-card',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => Alert.alert('Coming Soon', 'Payment methods will be available soon!'),
    },
    {
      icon: 'map-pin',
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      onPress: () => Alert.alert('Coming Soon', 'Address management will be available soon!'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      subtitle: 'Notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!'),
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title="Profile" showProfile={false} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-6">
          <View className="items-center">
            <View className="relative">
              <Image
                source={{ 
                  uri: user?.imageUrl || 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=U'
                }}
                className="w-24 h-24 rounded-full"
              />
              <TouchableOpacity className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                <Feather name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold text-gray-800 mt-4">
              {user?.fullName || 'User'}
            </Text>
            <Text className="text-gray-500 mt-1">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
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
    </SafeAreaView>
  );
};

export default Profile;