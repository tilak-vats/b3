import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Header from '@/components/Header';
import CategoryScroll from '@/components/CategoryScroll';
import ProductCard from '@/components/ProductCard';
import SortModal from '@/components/SortModal';
import { useProducts, Product } from '@/hooks/useProducts';

const CATEGORIES = [
  'All',
  'Snacks',
  'Beverages',
  'Kitchenware',
  'Daily Essentials',
  'Pooja',
  'Dry Fruits',
  'Spices',
  'Chocolates',
  'Sweets',
];

const Home = () => {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showSortModal, setShowSortModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = products.filter(
        product => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedCategory, sortBy]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <Header title="B3 Store" />
        <View className="flex-1 items-center justify-center px-4">
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchProducts}
            className="mt-4 px-6 py-3 bg-purple-500 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title="B3 Store" />
      
      <CategoryScroll
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <View className="flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <View className="flex-1" />
        <View className="flex-row items-center">
          <Text className="text-gray-600 mr-3 text-sm">
            {filteredAndSortedProducts.length} products
          </Text>
          <TouchableOpacity
            onPress={() => setShowSortModal(true)}
            className="flex-row items-center px-3 py-2 bg-gray-100 rounded-lg"
          >
            <Feather name="filter" size={14} color="#374151" />
            <Text className="ml-2 text-gray-700 font-medium text-sm">Sort</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredAndSortedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ 
          paddingHorizontal: 8,
          paddingVertical: 12,
          paddingBottom: 100 
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Feather name="package" size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">
              {isLoading ? 'Loading products...' : 'No products found'}
            </Text>
            {selectedCategory !== 'All' && (
              <Text className="text-gray-400 mt-2 text-center">
                Try selecting a different category or check back later
              </Text>
            )}
          </View>
        }
      />

      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSortSelect={setSortBy}
        currentSort={sortBy}
      />
    </SafeAreaView>
  );
};

export default Home;