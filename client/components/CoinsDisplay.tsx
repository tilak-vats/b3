import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CoinsDisplayProps {
  coins: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const CoinsDisplay: React.FC<CoinsDisplayProps> = ({ 
  coins, 
  size = 'medium', 
  showLabel = true 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 12,
          text: 'text-xs',
          label: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-4 py-3',
          icon: 20,
          text: 'text-lg font-bold',
          label: 'text-sm'
        };
      default:
        return {
          container: 'px-3 py-2',
          icon: 16,
          text: 'text-sm font-semibold',
          label: 'text-xs'
        };
    }
  };

  const classes = getSizeClasses();

  return (
    <View className={`bg-yellow-50 border border-yellow-200 rounded-full flex-row items-center ${classes.container}`}>
      <Feather name="star" size={classes.icon} color="#F59E0B" />
      <Text className={`ml-1 text-yellow-700 ${classes.text}`}>
        {coins.toLocaleString()}
      </Text>
      {showLabel && (
        <Text className={`ml-1 text-yellow-600 ${classes.label}`}>
          {coins === 1 ? 'coin' : 'coins'}
        </Text>
      )}
    </View>
  );
};

export default CoinsDisplay;