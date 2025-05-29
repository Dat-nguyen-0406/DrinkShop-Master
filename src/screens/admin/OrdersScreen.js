// src/screens/admin/OrdersScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'; // Removed getDocs, where
import app from '../../sever/firebase'; // Điều chỉnh đường dẫn đến file firebase.js của bạn

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Đang xử lý', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  const db = getFirestore(app);

  useEffect(() => {
    let unsubscribe;
    if (isFocused) {
      setIsLoading(true);
      const ordersRef = collection(db, 'orders');
      
      // Lắng nghe thay đổi theo thời gian thực với onSnapshot
      // Sắp xếp đơn hàng theo thời gian tạo mới nhất
      const q = query(ordersRef, orderBy('createdAt', 'desc'));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Chuyển đổi timestamp của Firebase sang số milliseconds nếu có
          const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().getTime()
            : (data.createdAt || new Date().getTime()); // Fallback if createdAt is missing or not a timestamp

          ordersData.push({
            id: doc.id,
            ...data,
            createdAt: createdAt, // Đảm bảo createdAt là số
            customer: data.userName || 'Khách hàng', // Dùng userName nếu có, không thì mặc định
            phone: data.phone || 'N/A', // Thêm trường userPhone nếu có
            items: data.items || [], // Đảm bảo có mảng items
            // Map status from Firestore to display text
            // Assuming Firestore statuses are like "Đang xử lý", "Đang giao", "Đã hoàn thành", "Đã hủy"
            status: data.status || 'Không xác định',
          });
        });
        setOrders(ordersData);
        // filterAndSearchOrders sẽ được gọi tự động nhờ useEffect thứ 2 khi orders thay đổi
        setIsLoading(false);
      }, (error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng.");
        setIsLoading(false);
      });
    }
    // Cleanup subscription on component unmount or when not focused
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isFocused]);

  useEffect(() => {
    filterAndSearchOrders(orders, statusFilter, searchQuery);
  }, [orders, statusFilter, searchQuery]); // Lọc lại khi orders, statusFilter, hoặc searchQuery thay đổi

  const filterAndSearchOrders = (allOrders, currentStatusFilter, currentSearchQuery) => {
    let tempOrders = allOrders;

    // Filter by status if not 'all'
    if (currentStatusFilter !== 'all') {
      tempOrders = tempOrders.filter(order => order.status === currentStatusFilter);
    }

    // Filter by search query
    if (currentSearchQuery.trim() !== '') {
      const lowercasedSearchText = currentSearchQuery.toLowerCase();
      tempOrders = tempOrders.filter(
        order =>
          String(order.id).toLowerCase().includes(lowercasedSearchText) ||
          (order.customer && order.customer.toLowerCase().includes(lowercasedSearchText)) ||
          (order.phone && order.phone.includes(lowercasedSearchText))
      );
    }

    setFilteredOrders(tempOrders);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã hoàn thành': return { backgroundColor: '#4CAF50', color: '#fff' }; // Green
      case 'Đang giao': return { backgroundColor: '#2196F3', color: '#fff' }; // Blue
      case 'Đang xử lý': return { backgroundColor: '#FF9800', color: '#fff' }; // Orange
      case 'Đã hủy': return { backgroundColor: '#F44336', color: '#fff' }; // Red
      default: return { backgroundColor: '#757575', color: '#fff' }; // Grey
    }
  };

  const renderStatusTab = (status, label) => (
    <TouchableOpacity
      style={[
        styles.statusTab,
        statusFilter === status && styles.activeStatusTab // Apply active style
      ]}
      onPress={() => setStatusFilter(status)}
    >
      <Text
        style={[
          styles.statusTabText,
          statusFilter === status && styles.activeStatusTabText // Apply active text style
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }) => {
    const statusStyles = getStatusStyle(item.status);
    const orderDate = new Date(item.createdAt);
    const timeString = orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateString = orderDate.toLocaleDateString('vi-VN');

    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Mã đơn: {String(item.id).slice(-6).toUpperCase()}</Text>
          <View style={[styles.orderStatus, { backgroundColor: statusStyles.backgroundColor }]}>
            <Text style={[styles.orderStatusText, { color: statusStyles.color }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.customerName}>Khách hàng: {item.customer}</Text>
          <Text style={styles.orderPhone}>SĐT: {item.phone}</Text>
        </View>

        <View style={styles.orderMeta}>
          <Text style={styles.orderTime}>{timeString} - {dateString}</Text>
          <Text style={styles.orderDetails}>
            {item.items ? item.items.length : 0} món · {item.total ? item.total.toLocaleString('vi-VN') : '0'}đ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6F4E37" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo khách hàng, mã đơn, SĐT..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statusTabContainer}>
        {renderStatusTab('all', 'Tất cả')}
        {renderStatusTab('Đang xử lý', 'Đang xử lý')}
        {renderStatusTab('Đang giao', 'Đang giao')}
        {renderStatusTab('Đã hoàn thành', 'Hoàn thành')}
        {renderStatusTab('Đã hủy', 'Đã hủy')}
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đơn hàng</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  statusTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    overflow: 'hidden', // Ensure borderRadius works correctly
  },
  statusTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2, // Retain border for consistency with active tab
    borderBottomColor: 'transparent', // Default transparent
  },
  activeStatusTab: {
    borderBottomColor: '#6F4E37', // Active tab bottom border color
  },
  statusTabText: {
    fontSize: 13, // Slightly smaller font for more tabs
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeStatusTabText: {
    color: '#6F4E37', // Active tab text color
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Add padding for bottom
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatusText: {
    fontSize: 12,
    color: 'white', // Default color, will be overridden by getStatusStyle
    fontWeight: '500',
  },
  orderInfo: {
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  orderPhone: {
    fontSize: 14,
    color: '#666',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  orderTime: {
    fontSize: 13,
    color: '#777',
  },
  orderDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F4E37', // Updated color
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default OrdersScreen;