import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface CategoryScrollProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <View className="bg-white border-b border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: 'center'
        }}
        style={{ flexGrow: 0 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onCategorySelect(category)}
            activeOpacity={0.7}
            className={`px-4 py-2 mr-3 rounded-full border ${
              selectedCategory === category
                ? 'bg-purple-500 border-purple-500'
                : 'bg-white border-gray-300'
            }`}
            style={{
              minWidth: 70,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              className={`font-medium text-sm ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-gray-700'
              }`}
              numberOfLines={1}
              style={{ textAlign: 'center' }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryScroll;