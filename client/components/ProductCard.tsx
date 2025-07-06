import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  barcode: string;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.barcode);
      Alert.alert('Success', `${product.name} added to cart!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 m-2 overflow-hidden" style={{ width: 180, height: 280 }}>
      {/* Product Image */}
      <View className="h-32 bg-gray-50">
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-100 items-center justify-center">
            <Feather name="image" size={24} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-3 flex-1">
        {/* Product Name - Fixed height with ellipsis */}
        <Text 
          className="text-base font-semibold text-gray-800 mb-1"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ height: 40 }}
        >
          {product.name}
        </Text>

        {/* Category */}
        <Text 
          className="text-xs text-gray-500 mb-2 capitalize"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.category}
        </Text>

        {/* Price */}
        <Text className="text-lg font-bold text-purple-600 mb-2">
          ₹{product.price}
        </Text>

        {/* Stock and Add to Cart */}
        <View className="flex-1 justify-end">
          <Text className="text-xs text-gray-500 mb-2">
            Stock: {product.quantity}
          </Text>
          
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isLoading || product.quantity === 0}
            className={`flex-row items-center justify-center px-3 py-2 rounded-lg ${
              product.quantity === 0
                ? 'bg-gray-200'
                : 'bg-purple-500'
            }`}
          >
            <Feather
              name="shopping-cart"
              size={14}
              color={product.quantity === 0 ? '#9CA3AF' : 'white'}
            />
            <Text
              className={`ml-2 text-xs font-medium ${
                product.quantity === 0 ? 'text-gray-500' : 'text-white'
              }`}
              numberOfLines={1}
            >
              {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;