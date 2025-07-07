import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Order } from '@/hooks/useOrders';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  isAdmin?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, isAdmin = false }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return order.deliveryOption === 'delivery' ? 'delivered' : 'delivered';
      default: return null;
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

  const nextStatus = getNextStatus(order.status);

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 mx-4 mb-4 p-4">
      {/* Order Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            Order #{order._id.slice(-6).toUpperCase()}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          <Text className="text-xs font-medium capitalize">
            {order.status}
          </Text>
        </View>
      </View>

      {/* Customer Info (Admin View) */}
      {isAdmin && (
        <View className="mb-3 p-3 bg-gray-50 rounded-lg">
          <Text className="text-sm font-medium text-gray-700 mb-1">Customer Details</Text>
          <Text className="text-sm text-gray-600">Email: {order.userEmail}</Text>
          <Text className="text-sm text-gray-600">Phone: {order.phoneNumber}</Text>
          <Text className="text-sm text-gray-600 capitalize">
            Type: {order.deliveryOption === 'delivery' ? 'Home Delivery' : 'Takeaway'}
          </Text>
          {order.deliveryOption === 'delivery' && (
            <Text className="text-sm text-gray-600">Address: {order.address}</Text>
          )}
          <Text className="text-sm text-gray-600 capitalize">
            Payment: {order.paymentOption === 'online' ? 'Online Payment' : 'Cash on ' + (order.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup')}
          </Text>
        </View>
      )}

      {/* Order Items */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-700 mb-2">Items ({order.items.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {order.items.map((item, index) => (
              <View key={index} className="mr-3 bg-gray-50 rounded-lg p-2 w-24">
                <View className="w-16 h-16 bg-gray-200 rounded-lg mb-2 overflow-hidden">
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
                <Text className="text-xs font-medium text-gray-800" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500">
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

      {/* Order Total */}
      <View className="flex-row justify-between items-center mb-3 pt-3 border-t border-gray-100">
        <Text className="text-base font-semibold text-gray-800">Total Amount</Text>
        <Text className="text-lg font-bold text-purple-600">₹{order.total.toFixed(2)}</Text>
      </View>

      {/* Admin Actions */}
      {isAdmin && nextStatus && onUpdateStatus && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => onUpdateStatus(order._id, nextStatus)}
            className="flex-1 bg-green-500 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-medium capitalize">
              Mark as {nextStatus}
            </Text>
          </TouchableOpacity>
          {order.status === 'pending' && (
            <TouchableOpacity
              onPress={() => onUpdateStatus(order._id, 'cancelled')}
              className="flex-1 bg-red-500 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-medium">Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default OrderCard;