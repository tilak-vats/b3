import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Order } from '@/hooks/useOrders';

interface OrderHistoryCardProps {
  order: Order;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'clock';
      case 'confirmed': return 'check-circle';
      case 'preparing': return 'package';
      case 'ready': return 'truck';
      case 'delivered': return 'check-circle-2';
      case 'cancelled': return 'x-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryText = () => {
    if (order.deliveryOption === 'delivery') {
      return 'Home Delivery';
    }
    return 'Store Pickup';
  };

  const getPaymentText = () => {
    if (order.paymentOption === 'online') {
      return 'Online Payment';
    }
    return `Cash on ${order.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}`;
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      {/* Order Header */}
      <View className="p-4 border-b border-gray-50">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-bold text-gray-800">
            Order #{order._id.slice(-6).toUpperCase()}
          </Text>
          <View className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
            <View className="flex-row items-center">
              <Feather 
                name={getStatusIcon(order.status) as any} 
                size={12} 
                color={order.status === 'delivered' ? '#059669' : 
                       order.status === 'cancelled' ? '#DC2626' :
                       order.status === 'ready' ? '#7C3AED' :
                       order.status === 'preparing' ? '#EA580C' :
                       order.status === 'confirmed' ? '#2563EB' : '#D97706'} 
              />
              <Text className="text-xs font-medium capitalize ml-1">
                {order.status}
              </Text>
            </View>
          </View>
        </View>
        
        <Text className="text-sm text-gray-500 mb-2">
          {formatDate(order.createdAt)}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="truck" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{getDeliveryText()}</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="credit-card" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{getPaymentText()}</Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View className="p-4">
        <Text className="text-sm font-medium text-gray-700 mb-3">
          Items ({order.items.length})
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {order.items.map((item, index) => (
              <View key={index} className="mr-3 bg-gray-50 rounded-lg p-3 w-28">
                <View className="w-20 h-20 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Feather name="image" size={16} color="#9CA3AF" />
                    </View>
                  )}
                </View>
                <Text className="text-xs font-medium text-gray-800 mb-1" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  Qty: {item.quantity}
                </Text>
                <Text className="text-xs font-bold text-purple-600">
                  ₹{item.price}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Order Summary */}
      <View className="px-4 pb-4">
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <Text className="text-base font-semibold text-gray-800">Total Amount</Text>
          <Text className="text-lg font-bold text-purple-600">₹{order.total.toFixed(2)}</Text>
        </View>
        
        {order.deliveryOption === 'delivery' && order.address && (
          <View className="mt-3 p-3 bg-gray-50 rounded-lg">
            <View className="flex-row items-start">
              <Feather name="map-pin" size={14} color="#6B7280" />
              <View className="ml-2 flex-1">
                <Text className="text-xs font-medium text-gray-700 mb-1">Delivery Address</Text>
                <Text className="text-xs text-gray-600">{order.address}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderHistoryCard;