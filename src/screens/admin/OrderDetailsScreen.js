// src/screens/admin/OrderDetailsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params || { orderId: '1' }; // Default for testing
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // Order status colors and labels
  const statusConfig = {
    'pending': { color: '#FF9800', icon: 'time-outline', label: 'Chờ xác nhận' },
    'confirmed': { color: '#2196F3', icon: 'checkmark-circle-outline', label: 'Đã xác nhận' },
    'preparing': { color: '#9C27B0', icon: 'cafe-outline', label: 'Đang pha chế' },
    'ready': { color: '#4CAF50', icon: 'bicycle-outline', label: 'Sẵn sàng giao' },
    'delivered': { color: '#009688', icon: 'checkmark-done-outline', label: 'Đã giao hàng' },
    'cancelled': { color: '#F44336', icon: 'close-circle-outline', label: 'Đã hủy' },
  };

  // Simulate fetching order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dummy data
        const orderData = {
          id: orderId,
          orderNumber: `HD${orderId.padStart(6, '0')}`,
          status: 'confirmed',
          orderDate: '15/04/2025 08:45',
          estimatedDelivery: '15/04/2025 09:15',
          customer: {
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
          },
          items: [
            {
              id: '1',
              name: 'Cà phê sữa đá',
              price: '29,000 đ',
              quantity: 2,
              options: ['Ít đường', 'Nhiều đá'],
              subtotal: '58,000 đ',
              image: 'https://via.placeholder.com/100'
            },
            {
              id: '2',
              name: 'Trà đào cam sả',
              price: '45,000 đ',
              quantity: 1,
              options: ['Ít đá', 'Không đường'],
              subtotal: '45,000 đ',
              image: 'https://via.placeholder.com/100'
            }
          ],
          payment: {
            method: 'Tiền mặt',
            status: 'Thanh toán khi nhận hàng',
          },
          subtotal: '103,000 đ',
          deliveryFee: '15,000 đ',
          discount: '10,000 đ',
          total: '108,000 đ',
          notes: 'Giao tại sảnh chính của tòa nhà, gọi điện khi đến.',
          staff: {
            created: 'Trần Minh',
            lastUpdated: 'Phạm Hùng',
          },
          logs: [
            { time: '15/04/2025 08:45', action: 'Đơn hàng được tạo', user: 'Trần Minh' },
            { time: '15/04/2025 08:52', action: 'Đã xác nhận đơn hàng', user: 'Phạm Hùng' },
          ]
        };
        
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng!');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateStatus = (newStatus) => {
    Alert.alert(
      'Cập nhật trạng thái',
      `Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${statusConfig[newStatus].label}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: () => {
            // Here would be the API call to update the order status
            setOrder(prev => ({
              ...prev,
              status: newStatus,
              logs: [
                { time: new Date().toLocaleString('vi-VN'), action: `Chuyển sang ${statusConfig[newStatus].label}`, user: 'Phạm Hùng' },
                ...prev.logs,
              ]
            }));
            Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công!');
          }
        }
      ]
    );
  };

  const handlePrintOrder = () => {
    Alert.alert('In đơn hàng', 'Đang gửi yêu cầu in đơn hàng...');
    // Implementation would connect to a printer service
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#D32F2F" />
        <Text style={styles.errorText}>Không tìm thấy thông tin đơn hàng!</Text>
      </View>
    );
  }

  const getNextStatus = () => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    if (order.status === 'cancelled') return null;
    if (order.status === 'delivered') return null;
    
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <ScrollView style={styles.container}>
      {/* Header with order number and status */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Đơn hàng #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{order.orderDate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig[order.status].color }]}>
          <Ionicons name={statusConfig[order.status].icon} size={18} color="#fff" />
          <Text style={styles.statusText}>{statusConfig[order.status].label}</Text>
        </View>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        {nextStatus && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: statusConfig[nextStatus].color }]}
            onPress={() => handleUpdateStatus(nextStatus)}
          >
            <Ionicons name="arrow-forward-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              Chuyển sang {statusConfig[nextStatus].label}
            </Text>
          </TouchableOpacity>
        )}
        
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleUpdateStatus('cancelled')}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#607D8B' }]}
          onPress={handlePrintOrder}
        >
          <Ionicons name="print" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>In đơn hàng</Text>
        </TouchableOpacity>
      </View>
      
      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <View style={styles.customerInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#8B0000" />
            <Text style={styles.infoLabel}>Tên:</Text>
            <Text style={styles.infoValue}>{order.customer.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#8B0000" />
            <Text style={styles.infoLabel}>SĐT:</Text>
            <Text style={styles.infoValue}>{order.customer.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#8B0000" />
            <Text style={styles.infoLabel}>Địa chỉ:</Text>
            <Text style={styles.infoValue}>{order.customer.address}</Text>
          </View>
        </View>
      </View>
      
      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm đặt hàng</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.orderItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <View style={styles.itemOptions}>
                {item.options.map((option, index) => (
                  <View key={index} style={styles.optionTag}>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.itemPriceRow}>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <Text style={styles.itemSubtotal}>{item.subtotal}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
      
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng kết đơn hàng</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính:</Text>
          <Text style={styles.summaryValue}>{order.subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
          <Text style={styles.summaryValue}>{order.deliveryFee}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giảm giá:</Text>
          <Text style={styles.summaryValue}>-{order.discount}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{order.total}</Text>
        </View>
      </View>
      
      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phương thức:</Text>
          <Text style={styles.infoValue}>{order.payment.method}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trạng thái:</Text>
          <Text style={styles.infoValue}>{order.payment.status}</Text>
        </View>
      </View>
      
      {/* Additional Information */}
      {order.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú đơn hàng</Text>
          <View style={styles.notesContainer}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#8B0000" />
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        </View>
      )}
      
      {/* Order Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
        {order.logs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <View style={styles.logDot} />
            <View style={styles.logContent}>
              <Text style={styles.logTime}>{log.time}</Text>
              <Text style={styles.logAction}>{log.action}</Text>
              <Text style={styles.logUser}>Bởi: {log.user}</Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* Staff Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin nhân viên</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Người tạo:</Text>
          <Text style={styles.infoValue}>{order.staff.created}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Người cập nhật cuối:</Text>
          <Text style={styles.infoValue}>{order.staff.lastUpdated}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  customerInfo: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B0000',
  },
  itemOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  optionTag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 12,
    color: '#555',
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B0000',
    marginTop: 4,
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logTime: {
    fontSize: 12,
    color: '#666',
  },
  logAction: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logUser: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default OrderDetailsScreen;