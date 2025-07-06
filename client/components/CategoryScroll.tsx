import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 py-3 bg-white border-b border-gray-100"
      contentContainerStyle={{ paddingRight: 16 }}
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
            minWidth: 80,
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
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryScroll;