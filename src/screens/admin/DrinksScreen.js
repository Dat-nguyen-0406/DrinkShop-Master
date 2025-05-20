import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

// Mock data - replace with actual API calls in production
const mockDrinks = [
  {
    id: "1",
    name: "Cà phê đen",
    category: "Cà phê",
    price: 25000,
    image: require("../../assets/images/cafe.jpg"),
    active: true,
  },
  {
    id: "2",
    name: "Trà sữa trân châu",
    category: "Trà sữa",
    price: 35000,
    image: require("../../assets/images/trasua.jpg"),
    active: true,
  },
  {
    id: "3",
    name: "Nước ép cam",
    category: "Nước ép",
    price: 30000,
    image: require("../../assets/images/nuocep.jpg"),
    active: true,
  },
  {
    id: "4",
    name: "Sinh tố xoài",
    category: "Sinh tố",
    price: 32000,
    image: require("../../assets/images/sinhto.jpg"),
    active: true,
  },
];

const DrinksScreen = ({ navigation }) => {
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchDrinks();
    }
  }, [isFocused]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDrinks(drinks);
    } else {
      const filtered = drinks.filter(
        (drink) =>
          drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drink.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrinks(filtered);
    }
  }, [searchQuery, drinks]);

  const fetchDrinks = async () => {
    // In a real app, you would fetch from an API
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setDrinks(mockDrinks);
        setFilteredDrinks(mockDrinks);
        setLoading(false);
      }, 500);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách đồ uống");
      setLoading(false);
    }
  };

  const handleDeleteDrink = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa đồ uống này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          // In a real app, call API to delete the drink
          const updatedDrinks = drinks.filter((drink) => drink.id !== id);
          setDrinks(updatedDrinks);
          setFilteredDrinks(filteredDrinks.filter((drink) => drink.id !== id));
        },
      },
    ]);
  };

  const renderDrinkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drinkItem}
      onPress={() => navigation.navigate("DrinkDetails", { drink: item })}
    >
      <Image source={item.image} style={styles.drinkImage} />
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <Text style={styles.drinkCategory}>{item.category}</Text>
        <Text style={styles.drinkPrice}>
          {item.price.toLocaleString("vi-VN")} đ
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate("EditDrink", { drink: item })}
        >
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteDrink(item.id)}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
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
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm đồ uống..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddDrink")}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Thêm đồ uống mới</Text>
      </TouchableOpacity>

      {filteredDrinks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đồ uống</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDrinks}
          keyExtractor={(item) => item.id}
          renderItem={renderDrinkItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  list: {
    flexGrow: 1,
  },
  drinkItem: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: "hidden",
  },
  drinkImage: {
    width: 100,
    height: 100,
  },
  drinkInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  drinkName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  drinkCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
  },
  actions: {
    justifyContent: "center",
    padding: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#757575",
  },
});

export default DrinksScreen;
