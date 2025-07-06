import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showProfile = true }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
      {showProfile && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className="p-2 rounded-full bg-gray-100"
        >
          <Feather name="user" size={20} color="#374151" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;