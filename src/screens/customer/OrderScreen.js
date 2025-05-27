import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import app from "../../sever/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OptionSelector = ({ label, selectedValue, onSelect }) => {
  const options = ["0%", "30%", "50%", "70%", "100%"];
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {options.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => onSelect(value)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: selectedValue === value ? "#6F4E37" : "#f5f5f5",
              borderRadius: 20,
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: selectedValue === value ? "#fff" : "#333" }}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{review.userName || "Khách hàng"}</Text>
        <Text style={styles.reviewDate}>
          {new Date(review.createdAt?.toDate()).toLocaleDateString("vi-VN")}
        </Text>
      </View>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name="star"
            size={16}
            color={star <= review.rating ? "#FFD700" : "#ccc"}
            style={{ marginRight: 5 }}
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{review.comment}</Text>
    </View>
  );
};

const OrderScreen = () => {
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [iceLevel, setIceLevel] = useState("100%");
  const [sugarLevel, setSugarLevel] = useState("100%");
  const route = useRoute();
  const navigation = useNavigation();

  const { drinkId } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("Nguyễn Thành Đạt"); // Lấy từ user data thực tế

  //cập nhập để xử lý khi từ giỏ hàng chuyển sang
  useEffect(() => {
    const fetchDrinkDetails = async () => {
      try {
        // Nếu có cartItem từ giỏ hàng thì sử dụng thông tin đó
        if (route.params?.cartItem) {
          const { cartItem } = route.params;
          setQuantity(cartItem.quantity);
          setIceLevel(cartItem.iceLevel);
          setSugarLevel(cartItem.sugarLevel);

          const db = getFirestore(app);
          const drinkRef = doc(db, "douong", cartItem.id.toString());
          const drinkSnap = await getDoc(drinkRef);

          if (drinkSnap.exists()) {
            setDrink({ id: drinkSnap.id, ...drinkSnap.data() });
          } else {
            Alert.alert("Lỗi", "Không tìm thấy đồ uống");
            navigation.goBack();
          }
        } else {
          // Nếu không phải từ giỏ hàng thì load như bình thường
          const db = getFirestore(app);
          const drinkRef = doc(db, "douong", drinkId.toString());
          const drinkSnap = await getDoc(drinkRef);

          if (drinkSnap.exists()) {
            setDrink({ id: drinkSnap.id, ...drinkSnap.data() });
          } else {
            Alert.alert("Lỗi", "Không tìm thấy đồ uống");
            navigation.goBack();
          }
        }
      } catch (error) {
        Alert.alert("Lỗi", "Có lỗi khi tải thông tin đồ uống");
        console.log("Lỗi thông tin đồ uống", error);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDrinkDetails();
  }, [drinkId, route.params?.cartItem]);

  // Lắng nghe review
  useEffect(() => {
    if (!drinkId) return;
    const db = getFirestore(app);
    const q = query(collection(db, "reviews"), where("drinkId", "==", drinkId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [drinkId]);

  const loadReviews = (drinkId) => {
    const db = getFirestore(app);
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("drinkId", "==", drinkId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    });

    return unsubscribe;
  };

  // Thay đổi hàm handleOrderNow trong OrderScreen.js
  const handleOrderNow = async () => {
    try {
      // Lấy thông tin người dùng từ AsyncStorage (nếu có)
      const userData = await AsyncStorage.getItem("userData");
      const userName = userData ? JSON.parse(userData).name : "Khách hàng";

      const newOrder = {
        id: Date.now().toString(),
        items: [
          {
            id: drink.id,
            name: drink.drinkname,
            price: parseInt(drink.price),
            quantity: quantity,
            image: drink.image,
            iceLevel: iceLevel,
            sugarLevel: sugarLevel,
            category: drink.category,
            description: drink.description,
          },
        ],
        status: "Đang xử lý",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total: parseInt(drink.price) * quantity,
        userName: userName,
      };

      // Lưu vào danh sách đơn hàng
      const existingOrders = await AsyncStorage.getItem("orders");
      let orders = existingOrders ? JSON.parse(existingOrders) : [];

      // Thêm đơn hàng mới vào đầu mảng
      orders.unshift(newOrder);
      await AsyncStorage.setItem("orders", JSON.stringify(orders));

      // Nếu từ giỏ hàng thì xóa sản phẩm đó khỏi giỏ hàng
      if (route.params?.fromCart) {
        const currentCart = await AsyncStorage.getItem("cart");
        let cart = currentCart ? JSON.parse(currentCart) : [];
        cart = cart.filter((item) => item.id !== drink.id);
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
      }

      // Hiển thị thông báo và chuyển hướng
      Alert.alert("Thành công", "Đơn hàng đã được đặt thành công!", [
        {
          text: "Xem đơn hàng",
          onPress: () => {
            navigation.navigate("CartTab", {
              screen: "Cart",
              params: {
                shouldRefresh: true,
                activeTab: "orders", // Mặc định hiển thị tab đơn hàng
              },
            });
          },
        },
        {
          text: "Tiếp tục mua hàng",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Lỗi", "Không thể đặt hàng");
    }
  };
  const handleSubmitReview = async () => {
    if (!review.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá.");
      return;
    }

    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá.");
      return;
    }

    try {
      const db = getFirestore(app);
      const reviewsRef = collection(db, "reviews");

      await addDoc(reviewsRef, {
        drinkId: drink.id,
        drinkName: drink.drinkname,
        userName: userName,
        rating: rating,
        comment: review,
        createdAt: new Date(),
      });

      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy thông tin đồ uống</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: drink.image }} style={styles.drinkImage} />

      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{drink.drinkname}</Text>
        <Text style={styles.drinkPrice}>
          {parseInt(drink.price).toLocaleString()}đ
        </Text>
        <Text style={styles.drinkDescription}>{drink.description}</Text>

        <OptionSelector
          label="Chọn lượng đá"
          selectedValue={iceLevel}
          onSelect={setIceLevel}
        />

        <OptionSelector
          label="Chọn lượng đường"
          selectedValue={sugarLevel}
          onSelect={setSugarLevel}
        />

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={decreaseQuantity}
              style={styles.quantityButton}
            >
              <FontAwesome name="minus" size={16} color="#6F4E37" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={styles.quantityButton}
            >
              <FontAwesome name="plus" size={16} color="#6F4E37" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>
            Đánh giá sản phẩm ({reviews.length})
          </Text>

          <View style={styles.reviewForm}>
            <Text style={styles.reviewFormTitle}>Viết đánh giá của bạn</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={28}
                    color="#FFD700"
                    style={{ marginRight: 5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Nhập đánh giá của bạn..."
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
              style={styles.reviewInput}
            />

            <TouchableOpacity
              onPress={handleSubmitReview}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            reviews.map((item) => <ReviewItem key={item.id} review={item} />)
          ) : (
            <Text style={styles.noReviewsText}>Chưa có đánh giá nào</Text>
          )}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>
            {(parseInt(drink.price) * quantity).toLocaleString()}đ
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.orderButton]}
          onPress={handleOrderNow}
        >
          <Text style={styles.buttonText}>Đặt hàng ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drinkImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  drinkInfo: {
    marginBottom: 20,
  },
  drinkName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  drinkPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6F4E37",
    marginBottom: 12,
  },
  drinkDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#333",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  reviewForm: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: "row",
    marginBottom: 15,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#6F4E37",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: "bold",
    color: "#333",
  },
  reviewDate: {
    color: "#999",
    fontSize: 12,
  },
  reviewText: {
    color: "#333",
    marginTop: 5,
    lineHeight: 20,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6F4E37",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "#6F4E37",
    marginRight: 10,
  },
  orderButton: {
    backgroundColor: "#6F4E37",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default OrderScreen;
