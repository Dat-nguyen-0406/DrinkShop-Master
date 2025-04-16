import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearToken } from '../../utils/storage'; // ✅ Thêm dòng này

// Mock data - replace with API calls in production
const mockStats = {
  todayOrders: 42,
  todayRevenue: 4250000,
  weeklyOrders: 286,
  weeklyRevenue: 27850000,
  monthlyOrders: 1245,
  monthlyRevenue: 134500000,
  popularDrinks: [
    { id: '1', name: 'Cà phê đen', quantity: 145 },
    { id: '2', name: 'Trà sữa trân châu', quantity: 112 },
    { id: '3', name: 'Nước ép cam', quantity: 87 },
    { id: '4', name: 'Sinh tố xoài', quantity: 76 },
  ],
  recentOrders: [
    { id: '101', customer: 'Nguyễn Văn A', total: 75000, time: '10:45', status: 'complete' },
    { id: '102', customer: 'Trần Thị B', total: 120000, time: '10:30', status: 'delivering' },
    { id: '103', customer: 'Lê Văn C', total: 95000, time: '10:15', status: 'processing' },
    { id: '104', customer: 'Phạm Thị D', total: 85000, time: '10:00', status: 'complete' },
    { id: '105', customer: 'Hoàng Văn E', total: 110000, time: '9:45', status: 'complete' },
  ]
};

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Bạn có chắc muốn đăng xuất?');
      if (confirm) {
        clearToken();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } else {
      Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await clearToken();
            navigation.replace({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]);
    }
  };

  const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' đ';

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tổng quan</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={fetchDashboardData} style={{ marginRight: 16 }}>
            <Ionicons name="refresh" size={24} color="#8B0000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#8B0000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Hôm nay</Text>
            <Ionicons name="today" size={24} color="#8B0000" />
          </View>
          <Text style={styles.statsValue}>{formatCurrency(stats.todayRevenue)}</Text>
          <Text style={styles.statsSubValue}>{stats.todayOrders} đơn hàng</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Tuần này</Text>
            <Ionicons name="calendar" size={24} color="#8B0000" />
          </View>
          <Text style={styles.statsValue}>{formatCurrency(stats.weeklyRevenue)}</Text>
          <Text style={styles.statsSubValue}>{stats.weeklyOrders} đơn hàng</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Tháng này</Text>
            <Ionicons name="bar-chart" size={24} color="#8B0000" />
          </View>
          <Text style={styles.statsValue}>{formatCurrency(stats.monthlyRevenue)}</Text>
          <Text style={styles.statsSubValue}>{stats.monthlyOrders} đơn hàng</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.viewMoreButton}
        onPress={() => navigation.navigate('RevenueStats')}
      >
        <Text style={styles.viewMoreButtonText}>Xem thống kê chi tiết</Text>
        <Ionicons name="arrow-forward" size={20} color="#8B0000" />
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đồ uống phổ biến</Text>
        </View>
        <View style={styles.popularDrinksContainer}>
          {stats.popularDrinks.map(drink => (
            <View key={drink.id} style={styles.popularDrinkItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{stats.popularDrinks.indexOf(drink) + 1}</Text>
              </View>
              <View style={styles.drinkDetails}>
                <Text style={styles.drinkName}>{drink.name}</Text>
                <Text style={styles.drinkQuantity}>{drink.quantity} đơn</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentOrdersContainer}>
          {stats.recentOrders.map(order => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderItem}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
              </View>
              <View style={styles.orderMeta}>
                <Text style={styles.orderTime}>{order.time}</Text>
                <View style={[styles.orderStatus, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.orderStatusText}>{getStatusText(order.status)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  statsCard: {
    flex: 1, backgroundColor: 'white', borderRadius: 8, padding: 12, marginHorizontal: 4,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2,
  },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statsTitle: { fontSize: 14, color: '#666' },
  statsValue: { fontSize: 18, fontWeight: 'bold', color: '#8B0000', marginBottom: 4 },
  statsSubValue: { fontSize: 12, color: '#666' },
  viewMoreButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 12, marginHorizontal: 16, marginBottom: 16, backgroundColor: 'white',
    borderRadius: 8, borderWidth: 1, borderColor: '#8B0000',
  },
  viewMoreButtonText: { marginRight: 8, color: '#8B0000', fontWeight: '500' },
  sectionContainer: {
    margin: 16, backgroundColor: 'white', borderRadius: 8, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  sectionTitle: { fontSize: 18, fontWeight: '500' },
  seeAllText: { color: '#8B0000', fontSize: 14 },
  popularDrinksContainer: { padding: 8 },
  popularDrinkItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  rankContainer: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#8B0000',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rankText: { color: 'white', fontWeight: 'bold' },
  drinkDetails: { flex: 1 },
  drinkName: { fontSize: 16, fontWeight: '500' },
  drinkQuantity: { fontSize: 13, color: '#666', marginTop: 2 },
  recentOrdersContainer: { padding: 8 },
  orderItem: {
    paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  orderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderCustomer: { fontSize: 16, fontWeight: '500' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#8B0000' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  orderTime: { fontSize: 13, color: '#666' },
  orderStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  orderStatusText: { fontSize: 12, color: 'white', fontWeight: '500' },
});

export default DashboardScreen;
