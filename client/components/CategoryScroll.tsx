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
          className={`px-4 py-2 mr-3 rounded-full ${
            selectedCategory === category
              ? 'bg-purple-500'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium text-sm ${
              selectedCategory === category
                ? 'text-white'
                : 'text-gray-700'
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryScroll;