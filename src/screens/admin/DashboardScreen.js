import React, { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { clearAllStorage } from "../../utils/storage";

// Import Firestore modules
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from "../../sever/firebase"; // Đảm bảo đường dẫn đúng

const DashboardScreen = ({ navigation }) => { // Thêm navigation nếu bạn muốn điều hướng từ đây
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    weeklyOrders: 0,
    weeklyRevenue: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    popularDrinks: [], // Placeholder, cần logic để tính toán từ Firestore
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   useFocusEffect(
    useCallback(() => {
      console.log("DashboardScreen được focus, tải lại dữ liệu ban đầu và thiết lập interval.");
      fetchDashboardData(); // Tải dữ liệu ngay khi màn hình được focus

      // Thiết lập interval để tự động cập nhật định kỳ (ví dụ: mỗi 1 phút)
      const intervalId = setInterval(() => {
        console.log("Tự động cập nhật dữ liệu dashboard định kỳ...");
        fetchDashboardData();
      }, 60000); // 60000 ms = 1 phút

      // Cleanup function
      return () => {
        console.log("DashboardScreen bị blur hoặc unmount, xóa interval.");
        clearInterval(intervalId); // Xóa interval khi màn hình không còn focus
      };
    }, [])
  );
  useEffect(() => {
      fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore(app);

      // --- Date Range Calculations ---
      const now = new Date();
      // Reset time to start of day for comparison to avoid time-of-day issues
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Today's range
      const todayStart = new Date(today);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      // Week's range (Monday to Sunday)
      const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      // Calculate the date of the Monday of the current week
      const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const weekStart = new Date(today.setDate(diffToMonday));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Month's range
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
      monthEnd.setHours(23, 59, 59, 999);

      // --- Fetch Orders for Statistics ---
      // Fetch all orders (or a sufficiently large range, e.g., last 30-60 days to be safe for monthly stats)
      const ordersRef = collection(db, "orders");
      const allOrdersQuery = query(ordersRef, orderBy("createdAt", "desc")); // Fetch all, then filter in memory
      const allOrdersSnapshot = await getDocs(allOrdersQuery);

      let calculatedTodayOrders = 0;
      let calculatedTodayRevenue = 0;
      let calculatedWeeklyOrders = 0;
      let calculatedWeeklyRevenue = 0;
      let calculatedMonthlyOrders = 0;
      let calculatedMonthlyRevenue = 0;
      const fetchedRecentOrders = [];

      allOrdersSnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to JavaScript Date object
        const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : (data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt)); // Handle if already a Date or number timestamp

        // Only consider completed orders for revenue calculation
        if (data.status === 'Đã hoàn thành') {
          const orderTotal = parseFloat(data.total) || 0; // Ensure total is a number

          // Check for Today's stats
          if (createdAt >= todayStart && createdAt <= todayEnd) {
            calculatedTodayOrders++;
            calculatedTodayRevenue += orderTotal;
          }

          // Check for Weekly stats
          if (createdAt >= weekStart && createdAt <= weekEnd) {
            calculatedWeeklyOrders++;
            calculatedWeeklyRevenue += orderTotal;
          }

          // Check for Monthly stats
          if (createdAt.getMonth() === monthStart.getMonth() && createdAt.getFullYear() === monthStart.getFullYear()) {
            calculatedMonthlyOrders++;
            calculatedMonthlyRevenue += orderTotal;
          }
        }

        // Add to recent orders (up to 5, regardless of status)
        if (fetchedRecentOrders.length < 5) {
            fetchedRecentOrders.push({
                id: doc.id,
                customer: data.userName || "Khách hàng",
                total: parseFloat(data.total) || 0,
                time: createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                status: data.status || "Unknown",
            });
        }
      });

      setStats(prevStats => ({
        ...prevStats,
        todayOrders: calculatedTodayOrders,
        todayRevenue: calculatedTodayRevenue,
        weeklyOrders: calculatedWeeklyOrders,
        weeklyRevenue: calculatedWeeklyRevenue,
        monthlyOrders: calculatedMonthlyOrders,
        monthlyRevenue: calculatedMonthlyRevenue,
        recentOrders: fetchedRecentOrders,
      }));

    } catch (e) {
      console.error("Lỗi khi tải dữ liệu dashboard:", e);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      Alert.alert("Lỗi", "Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: async () => {
            await logout();
            await clearAllStorage();
            navigation.replace("Login"); // Chuyển về màn hình đăng nhập
          },
        },
      ]
    );
  };

  // Helper function to get status styles for orders
  const getOrderStatusStyle = (status) => {
    switch (status) {
      case 'Đã hoàn thành':
        return { backgroundColor: '#4CAF50', color: '#fff' }; // Green
      case 'Đang giao':
        return { backgroundColor: '#2196F3', color: '#fff' }; // Blue
      case 'Đang xử lý':
        return { backgroundColor: '#FF9800', color: '#fff' }; // Orange for processing
      case 'Đã hủy':
        return { backgroundColor: '#F44336', color: '#fff' }; // Red
      default:
        return { backgroundColor: '#757575', color: '#fff' }; // Grey
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6F4E37" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doanh thu</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#8B4513" />
        </TouchableOpacity>
      </View>

      {/* Overview Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đơn hàng hôm nay</Text>
          <Text style={styles.statValue}>{stats.todayOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Doanh thu hôm nay</Text>
          <Text style={styles.statValue}>{stats.todayRevenue.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đơn hàng tuần này</Text>
          <Text style={styles.statValue}>{stats.weeklyOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Doanh thu tuần này</Text>
          <Text style={styles.statValue}>{stats.weeklyRevenue.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đơn hàng tháng này</Text>
          <Text style={styles.statValue}>{stats.monthlyOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Doanh thu tháng này</Text>
          <Text style={styles.statValue}>{stats.monthlyRevenue.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
      </View>
      <View style={styles.recentOrdersContainer}>
        {stats.recentOrders.length === 0 ? (
          <Text style={styles.emptySectionText}>Không có đơn hàng gần đây.</Text>
        ) : (
          stats.recentOrders.map((order) => {
            const statusStyles = getOrderStatusStyle(order.status);
            return (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>Mã đơn: {String(order.id).slice(-6).toUpperCase()}</Text>
                  <View style={[styles.orderStatusBadge, { backgroundColor: statusStyles.backgroundColor }]}>
                    <Text style={[styles.orderStatusText, { color: statusStyles.color }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderCustomer}>Khách hàng: {order.customer}</Text>
                <Text style={styles.orderTotal}>Tổng tiền: {order.total.toLocaleString('vi-VN')}đ</Text>
                <Text style={styles.orderTime}>Thời gian: {order.time}</Text>
              </View>
            );
          })
        )}
      </View>

      {/* Placeholder for other sections */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#6F4E37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Adjust for status bar
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  seeAllText: { color: "#6F4E37", fontSize: 14, fontWeight: "500" },
  emptySectionText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 15,
    marginBottom: 15,
    fontSize: 14,
  },
  popularDrinksContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingBottom: 5, // Add some padding
  },
  popularDrinkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6F4E37", // Coffee color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: { color: "white", fontWeight: "bold" },
  drinkDetails: { flex: 1 },
  drinkName: { fontSize: 16, fontWeight: "500", color: "#333" },
  drinkQuantity: { fontSize: 13, color: "#666", marginTop: 2 },
  recentOrdersContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingBottom: 5, // Add some padding
  },
  orderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: 'center',
  },
  orderId: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  orderCustomer: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B4513", // Coffee color
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 13,
    color: "#777",
  },
});

export default DashboardScreen;