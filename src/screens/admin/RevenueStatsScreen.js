// src/screens/admin/RevenueStatsScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock Data for demonstration
const mockRevenueData = {
  totalRevenue: 150000000, // Example total revenue
  totalOrders: 1500, // Example total orders
  averageOrderValue: 100000, // Example average
  todayRevenue: 5000000,
  thisMonthRevenue: 45000000,
};

const mockRecentSales = [
  { id: '1', orderId: 'ORD001', customer: 'Nguyễn Văn A', amount: 120000, date: '2024-05-17 14:30' },
  { id: '2', orderId: 'ORD002', customer: 'Trần Thị B', amount: 85000, date: '2024-05-17 11:00' },
  { id: '3', orderId: 'ORD003', customer: 'Lê Văn C', amount: 210000, date: '2024-05-16 18:45' },
  { id: '4', orderId: 'ORD004', customer: 'Phạm Thu D', amount: 50000, date: '2024-05-16 09:15' },
  { id: '5', orderId: 'ORD005', customer: 'Hoàng Minh E', amount: 150000, date: '2024-05-15 16:20' },
];

const RevenueStatsScreen = () => {
  const renderRecentSaleItem = ({ item }) => (
    <View style={styles.recentSaleItem}>
      <View>
        <Text style={styles.recentSaleOrderId}>#{item.orderId}</Text>
        <Text style={styles.recentSaleCustomer}>{item.customer}</Text>
        <Text style={styles.recentSaleDate}>{item.date}</Text>
      </View>
      <Text style={styles.recentSaleAmount}>{item.amount.toLocaleString('vi-VN')} đ</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê Doanh thu</Text>
        {/* Optional: Date range picker placeholder */}
        <TouchableOpacity style={styles.dateFilterButton}>
          <Ionicons name="calendar-outline" size={20} color="#8B4513" />
          <Text style={styles.dateFilterText}>Hôm nay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Tổng Doanh thu</Text>
          <Text style={styles.summaryCardValue}>
            {mockRevenueData.totalRevenue.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={styles.summaryCardSubtitle}>Tất cả thời gian</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Tổng Đơn hàng</Text>
          <Text style={styles.summaryCardValue}>
            {mockRevenueData.totalOrders.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.summaryCardSubtitle}>Tổng số</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Đơn trung bình</Text>
          <Text style={styles.summaryCardValue}>
            {mockRevenueData.averageOrderValue.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={styles.summaryCardSubtitle}>Giá trị trung bình</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Doanh thu hôm nay</Text>
          <Text style={styles.summaryCardValue}>
            {mockRevenueData.todayRevenue.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={styles.summaryCardSubtitle}>Cập nhật mới nhất</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Doanh thu theo thời gian</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>[Biểu đồ doanh thu hàng ngày/tháng sẽ hiển thị ở đây]</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Sản phẩm bán chạy nhất</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>[Biểu đồ các sản phẩm bán chạy nhất sẽ hiển thị ở đây]</Text>
        </View>
      </View>

      <View style={styles.recentSalesSection}>
        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
        <FlatList
          data={mockRecentSales}
          keyExtractor={(item) => item.id}
          renderItem={renderRecentSaleItem}
          scrollEnabled={false} // Disable scrolling for FlatList inside ScrollView
          ListEmptyComponent={<Text style={styles.noRecentSalesText}>Chưa có đơn hàng gần đây.</Text>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Light background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateFilterText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%', // Approx half width for two columns
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 5,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Theme color for values
  },
  summaryCardSubtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
  },
  recentSalesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSaleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  recentSaleOrderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  recentSaleCustomer: {
    fontSize: 14,
    color: '#555555',
    marginTop: 2,
  },
  recentSaleDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  recentSaleAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  noRecentSalesText: {
    textAlign: 'center',
    color: '#777777',
    fontSize: 14,
    marginTop: 10,
  },
});

export default RevenueStatsScreen;