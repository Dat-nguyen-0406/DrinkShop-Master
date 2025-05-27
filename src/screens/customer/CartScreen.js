import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-web";

const CartScreen = ({ route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("cart");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  useEffect(() => {
    if (isFocused) {
      loadCartItems();
      loadOrders();
    }
  }, [isFocused]);

  const loadCartItems = async () => {
    const data = await AsyncStorage.getItem("cart");
    setCartItems(data ? JSON.parse(data) : []);
  };

  const loadOrders = async () => {
    const data = await AsyncStorage.getItem("orders");
    setOrders(data ? JSON.parse(data) : []);
  };

  const removeFromCart = async (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    await AsyncStorage.setItem("cart", JSON.stringify(newCart));
  };

  const goToOrderScreen = (navigation, item) => {
    navigation.navigate("Order", {
      cartItem: item,
      fromCart: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "orders" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("orders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.activeTabText,
            ]}
          >
            Đơn hàng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      <ScrollView style={styles.content}>
        {activeTab === "cart" ? (
          cartItems.length === 0 ? (
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>Lượng đường: {item.sugarLevel}</Text>
                <Text>Lượng đá: {item.iceLevel}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text>
                  Giá: {(parseInt(item.price) * item.quantity).toLocaleString()}
                  đ
                </Text>
                <View style={styles.cartActions}>
                  <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() =>
                      goToOrderScreen(route.params?.navigation, item)
                    }
                  >
                    <FontAwesome name="shopping-cart" size={16} color="#fff" />
                    <Text style={styles.cartButtonText}>Đặt hàng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Xác nhận",
                        "Bạn có muốn xoá sản phẩm này khỏi giỏ hàng?",
                        [
                          { text: "Huỷ" },
                          {
                            text: "Xoá",
                            onPress: () => removeFromCart(item.id),
                            style: "destructive",
                          },
                        ]
                      )
                    }
                  >
                    <FontAwesome name="trash" size={20} color="#c00" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
        ) : (
          orders.map((order, orderIndex) => (
            <View
              key={`order-${orderIndex}-${order.id}`}
              style={styles.itemCard}
            >
              <Text style={styles.itemName}>
                Mã đơn: {String(order.id).slice(-6).toUpperCase()}
              </Text>
              <Text>Trạng thái: {order.status}</Text>
              <Text>
                Thời gian: {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Text>

              {Array.isArray(order.items) &&
                order.items.map((item, itemIndex) => (
                  <View
                    key={`order-${orderIndex}-item-${itemIndex}`}
                    style={{ marginVertical: 5 }}
                  >
                    <Text>{item.name}</Text>
                    <Text>
                      {item.quantity} x {parseInt(item.price).toLocaleString()}đ
                    </Text>
                  </View>
                ))}

              <Text style={styles.totalText}>
                Tổng cộng:{" "}
                {(typeof order.total === "number"
                  ? order.total
                  : 0
                ).toLocaleString()}
                đ
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#6F4E37",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#6F4E37",
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
  },
  itemCard: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    borderRadius: 8,
    elevation: 1,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  totalText: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#6F4E37",
  },
  cartActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  cartButton: {
    flexDirection: "row",
    backgroundColor: "#6F4E37",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cartButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  //xóa
  orderActionContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  deleteOrderButton: {
    flexDirection: "row",
    backgroundColor: "#c00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteOrderText: {
    color: "#fff",
    marginLeft: 5,
  },
});

export default CartScreen;
