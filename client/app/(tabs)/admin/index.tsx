import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useProducts, Product } from '@/hooks/useProducts';
import { useOrders, Order } from '@/hooks/useOrders';
import ProductCard from '@/components/ProductCard';
import OrderCard from '@/components/OrderCard';
import EditProductModal from '@/components/EditProductModal';

const ADMIN_TABS = ['Active Orders', 'Past Orders', 'Products', 'Analytics'];

const AdminPanel = () => {
  const { products, isLoading: productsLoading, fetchProducts } = useProducts();
  const { orders, isLoading: ordersLoading, fetchAllOrders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('Active Orders');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter orders based on status
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  );
  
  const pastOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  // Fetch appropriate data based on active tab
  useEffect(() => {
    if (activeTab === 'Active Orders' || activeTab === 'Past Orders') {
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

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'Active Orders': return activeOrders.length;
      case 'Past Orders': return pastOrders.length;
      case 'Products': return products.length;
      default: return 0;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Products':
        return (
          <FlatList
            key="products-grid"
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
      case 'Active Orders':
        return (
          <FlatList
            key="active-orders-list"
            data={activeOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            numColumns={1}
            contentContainerStyle={{ 
              paddingVertical: 12,
              paddingBottom: 100 
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Feather name="clock" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-500 mt-4">
                  {ordersLoading ? 'Loading orders...' : 'No active orders'}
                </Text>
                <Text className="text-gray-400 mt-2 text-center">
                  Active orders will appear here when customers place orders
                </Text>
              </View>
            }
          />
        );
      case 'Past Orders':
        return (
          <FlatList
            key="past-orders-list"
            data={pastOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            numColumns={1}
            contentContainerStyle={{ 
              paddingVertical: 12,
              paddingBottom: 100 
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Feather name="archive" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-500 mt-4">
                  {ordersLoading ? 'Loading past orders...' : 'No past orders'}
                </Text>
                <Text className="text-gray-400 mt-2 text-center">
                  Completed and cancelled orders will appear here
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
          <Text className="text-sm text-gray-600 mr-2">
            {getTabCount(activeTab)} {activeTab.toLowerCase()}
          </Text>
        </View>
      </View>

      {/* Admin Tab Bar */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row px-4 py-2">
          {ADMIN_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`px-3 py-2 mr-2 rounded-full ${
                activeTab === tab
                  ? 'bg-blue-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium text-xs ${
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