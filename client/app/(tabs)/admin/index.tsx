import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useProducts, Product } from '@/hooks/useProducts';
import { useOrders, Order } from '@/hooks/useOrders';
import ProductCard from '@/components/ProductCard';
import OrderCard from '@/components/OrderCard';
import EditProductModal from '@/components/EditProductModal';

const ADMIN_TABS = ['Products', 'Orders', 'Analytics'];

const AdminPanel = () => {
  const { products, isLoading: productsLoading, fetchProducts } = useProducts();
  const { orders, isLoading: ordersLoading, fetchAllOrders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('Orders');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch appropriate data based on active tab
  React.useEffect(() => {
    if (activeTab === 'Orders') {
      fetchAllOrders();
    } else if (activeTab === 'Products') {
      fetchProducts();
    }
  }, [activeTab]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    fetchProducts(); // Refresh products after edit
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      Alert.alert('Success', `Order status updated to ${status}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item} 
      isAdmin={true}
      onEdit={handleEditProduct}
    />
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard 
      order={item} 
      isAdmin={true}
      onUpdateStatus={handleUpdateOrderStatus}
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Products':
        return (
          <FlatList
            key="products-grid" // Add unique key for products grid
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={{ 
              paddingHorizontal: 8,
              paddingVertical: 12,
              paddingBottom: 100 
            }}
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Feather name="package" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-500 mt-4">
                  {productsLoading ? 'Loading products...' : 'No products found'}
                </Text>
              </View>
            }
          />
        );
      case 'Orders':
        return (
          <FlatList
            key="orders-list" // Add unique key for orders list
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            numColumns={1} // Explicitly set numColumns for orders
            contentContainerStyle={{ 
              paddingVertical: 12,
              paddingBottom: 100 
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Feather name="shopping-bag" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-500 mt-4">
                  {ordersLoading ? 'Loading orders...' : 'No orders found'}
                </Text>
              </View>
            }
          />
        );
      case 'Analytics':
        return (
          <View className="flex-1 items-center justify-center">
            <Feather name="bar-chart-2" size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">
              Analytics Dashboard
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              Coming Soon
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Feather name="shield" size={24} color="#8B5CF6" />
          <Text className="text-xl font-bold text-gray-800 ml-2">Admin Panel</Text>
        </View>
        <View className="flex-row items-center">
          {activeTab === 'Orders' && (
            <Text className="text-sm text-gray-600 mr-2">
              {orders.length} orders
            </Text>
          )}
          {activeTab === 'Products' && (
            <Text className="text-sm text-gray-600 mr-2">
              {products.length} products
            </Text>
          )}
        </View>
      </View>

      {/* Admin Tab Bar */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row px-4 py-2">
          {ADMIN_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-3 rounded-full ${
                activeTab === tab
                  ? 'bg-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Edit Product Modal */}
      <EditProductModal
        visible={showEditModal}
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default AdminPanel;