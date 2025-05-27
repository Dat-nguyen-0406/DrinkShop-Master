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

// Import Firestore functions
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import app from "../../sever/firebase";

// Initialize Firestore DB
const db = getFirestore(app);

const DrinksScreen = ({ navigation }) => {
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("DrinksScreen: Màn hình đang được focus, gọi fetchDrinks.");
      fetchDrinks();
    }
  }, [isFocused]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDrinks(drinks);
    } else {
      const filtered = drinks.filter(
        (drink) =>
          drink.drinkname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drink.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrinks(filtered);
    }
    console.log("DrinksScreen: Cập nhật danh sách lọc hoặc tìm kiếm.");
  }, [searchQuery, drinks]);

  const fetchDrinks = async () => {
    setLoading(true);
    console.log("DrinksScreen: Bắt đầu fetchDrinks.");
    try {
      console.log("DrinksScreen: Chuẩn bị lấy dữ liệu từ collection 'drinks'...");
      const querySnapshot = await getDocs(collection(db, "douong"));
      console.log(`DrinksScreen: Đã nhận querySnapshot. Số lượng tài liệu: ${querySnapshot.size}`);

      const fetchedDrinks = [];
      if (querySnapshot.empty) {
        console.log("DrinksScreen: Collection 'drinks' rỗng hoặc không tìm thấy tài liệu nào.");
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`DrinksScreen: Đang xử lý tài liệu ID: ${doc.id}, Dữ liệu:`, data);
          fetchedDrinks.push({
            id: doc.id,
            category: data.category,
            description: data.description,
            drinkname: data.drinkname,
            image: data.image,
            price: parseFloat(data.price),
            quatiy: parseInt(data.quatiy),
            start: parseFloat(data.start),
            status: data.status,
          });
        });
      }
      console.log("DrinksScreen: Đã fetch xong, tổng số đồ uống:", fetchedDrinks.length);
      setDrinks(fetchedDrinks);
      setFilteredDrinks(fetchedDrinks);
    } catch (error) {
      console.error("DrinksScreen: Lỗi khi fetch đồ uống:", error);
      Alert.alert("Lỗi", `Không thể tải danh sách đồ uống từ Firestore: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("DrinksScreen: Kết thúc fetchDrinks.");
    }
  };

  const handleDeleteDrink = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa đồ uống này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          console.log(`DrinksScreen: Bắt đầu xóa đồ uống với ID: ${id}`);
          try {
            await deleteDoc(doc(db, "drinks", id));
            console.log(`DrinksScreen: Đã xóa thành công đồ uống ID: ${id}`);
            Alert.alert("Thành công", "Đồ uống đã được xóa.");
            fetchDrinks();
          } catch (error) {
            console.error(`DrinksScreen: Lỗi khi xóa đồ uống ID ${id}:`, error);
            Alert.alert("Lỗi", `Không thể xóa đồ uống: ${error.message}`);
          } finally {
            setLoading(false);
            console.log("DrinksScreen: Kết thúc quá trình xóa.");
          }
        },
      },
    ]);
  };

  const renderDrinkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drinkItem}
      onPress={() => navigation.navigate("DrinkDetails", { drink: item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.drinkImage}
      />
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{item.drinkname}</Text>
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
        <Text style={{ marginTop: 10 }}>Đang tải đồ uống...</Text>
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
          <Text style={styles.emptyText}>Không tìm thấy đồ uống nào.</Text>
          <Text style={styles.emptyText}>Vui lòng kiểm tra lại dữ liệu trên Firebase Firestore.</Text>
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
    resizeMode: 'cover',
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
    textAlign: "center",
    marginBottom: 5,
  },
});

export default DrinksScreen;