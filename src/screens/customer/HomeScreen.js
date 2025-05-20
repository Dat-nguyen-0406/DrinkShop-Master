import React, { useState, useEffect } from "react";
import app from "../../sever/firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import {
  View,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native-web";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  const [coffeeItem, setCoffeeItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);

        // Fetch coffee items
        const coffeeSnapshot = await getDocs(collection(db, "douong"));
        const coffeeItems = coffeeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoffeeItems(coffeeItems);

        // Fetch header data
        const headerSnapshot = await getDocs(collection(db, "photo"));
        if (!headerSnapshot.empty) {
          const headerDoc = headerSnapshot.docs[0].data();
          setHeaderData({
            title: headerDoc.title || "Cà phê chất lượng",
            image: headerDoc.Image || "https://via.placeholder.com/400x200",
          });
        }

        setPromotions([
          { id: 1, text: "Giảm 20%", description: "Cho đơn hàng đầu tiên" },
        ]);
      } catch (err) {
        console.error("Firestore error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCategoryHeader = () => (
    <View style={styles.headerContainer}>
      {headerData ? (
        <>
          <Text style={styles.mainTitle}>{headerData.title}</Text>
          <Image
            source={{ uri: headerData.image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {/* Phần danh mục */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <View style={styles.categoryGrid}>
              <Text style={styles.categoryItem}>Cà phê</Text>
              <Text style={styles.categoryItem}>Trà</Text>
              <Text style={styles.categoryItem}>Nước ép</Text>
              <Text style={styles.categoryItem}>Khác</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Lỗi khi tải dữ liệu: {error}</Text>
        <Text>Vui lòng kiểm tra kết nối hoặc liên hệ quản trị viên</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.drinkname}</Text>
          <Text style={styles.itemPrice}>{item.price}đ</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  const renderPromotion = ({ item }) => (
    <View style={styles.promotionContainer}>
      <Text style={styles.promotionTitle}>{item.text}</Text>
      <Text style={styles.promotionDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coffeeItem}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderCategoryHeader}
        ListFooterComponent={
          <FlatList
            data={promotions}
            renderItem={renderPromotion}
            keyExtractor={(item) => item.id.toString()}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  headerContainer: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    textAlign: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  categoryHeader: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  brandText: {
    fontWeight: "bold",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  itemContainer: {
    marginBottom: 15,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#FFD700",
  },
  promotionContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  promotionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  promotionDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomeScreen;
