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

// Mock data - replace with API calls in production
const mockOrders = [
  { 
    id: '101', 
    customer: 'Nguyễn Văn A', 
    phone: '0901234567',
    total: 75000, 
    items: 3,
    time: '11:45',
    date: '14/04/2025',
    status: 'complete' 
  },
  { 
    id: '102', 
    customer: 'Trần Thị B', 
    phone: '0908765432',
    total: 120000, 
    items: 5,
    time: '11:30',
    date: '14/04/2025',
    status: 'delivering' 
  },
  { 
    id: '103', 
    customer: 'Lê Văn C', 
    phone: '0905678901',
    total: 95000, 
    items: 4,
    time: '10:15',
    date: '14/04/2025',
    status: 'processing' 
  },
  { 
    id: '104', 
    customer: 'Phạm Thị D', 
    phone: '0901112223',
    total: 85000, 
    items: 3,
    time: '10:00',
    date: '14/04/2025',
    status: 'complete' 
  },
  { 
    id: '105', 
    customer: 'Hoàng Văn E', 
    phone: '0903334445',
    total: 110000, 
    items: 4,
    time: '09:45',
    date: '14/04/2025',
    status: 'complete' 
  },
  { 
    id: '106', 
    customer: 'Vũ Thị F', 
    phone: '0906667778',
    total: 65000, 
    items: 2,
    time: '16:30',
    date: '13/04/2025',
    status: 'complete' 
  },
  { 
    id: '107', 
    customer: 'Đặng Văn G', 
    phone: '0909998887',
    total: 150000, 
    items: 6,
    time: '15:45',
    date: '13/04/2025',
    status: 'complete' 
  },
];

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused]);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const fetchOrders = async () => {
    // In a real app, you would fetch from an API
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        order => 
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery)
      );
    }
    
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return '#4CAF50';
      case 'delivering': return '#2196F3';
      case 'processing': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete': return 'Hoàn thành';
      case 'delivering': return 'Đang giao';
      case 'processing': return 'Đang xử lý';
      default: return 'Không xác định';
    }
  };

  const renderStatusTab = (status, label) => (
    <TouchableOpacity
      style={[
        styles.statusTab,
        statusFilter === status && { borderBottomColor: '#8B0000' }
      ]}
      onPress={() => setStatusFilter(status)}
    >
      <Text
        style={[
          styles.statusTabText,
          statusFilter === status && { color: '#8B0000', fontWeight: 'bold' }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Đơn #{item.id}</Text>
        <View style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.orderStatusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.orderPhone}>{item.phone}</Text>
      </View>
      
      <View style={styles.orderMeta}>
        <Text style={styles.orderTime}>{item.time} - {item.date}</Text>
        <Text style={styles.orderDetails}>{item.items} món · {item.total.toLocaleString('vi-VN')}đ</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
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
        {renderStatusTab('processing', 'Đang xử lý')}
        {renderStatusTab('delivering', 'Đang giao')}
        {renderStatusTab('complete', 'Hoàn thành')}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  statusTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  statusTabText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    paddingHorizontal: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  orderInfo: {
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderPhone: {
    fontSize: 14,
    color: '#666',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTime: {
    fontSize: 13,
    color: '#666',
  },
  orderDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B0000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
  },
});

export default OrdersScreen;