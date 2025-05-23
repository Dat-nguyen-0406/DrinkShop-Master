import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const DrinkDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { drinkId } = route.params;

  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedIce, setSelectedIce] = useState("50%");
  const [selectedSugar, setSelectedSugar] = useState("50%");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock data for development
  useEffect(() => {
    const fetchDrink = async () => {
      setLoading(true);
      try {
        // Mock data
        setTimeout(() => {
          const mockDrink = {
            id: drinkId,
            name: "Cà phê sữa đá",
            image: require("../../assets/images/cafe.jpg"),
            price: 25000,
            rating: 4.5,
            description:
              "Cà phê sữa đá là thức uống truyền thống của Việt Nam, được làm từ cà phê nguyên chất pha với sữa đặc và đá.",
            ingredients: ["Cà phê robusta", "Sữa đặc", "Đá viên"],
            sizes: [
              { name: "M", price: 25000 },
              { name: "L", price: 30000 },
              { name: "XL", price: 35000 },
            ],
            iceOptions: ["0%", "30%", "50%", "70%", "100%"],
            sugarOptions: ["0%", "30%", "50%", "70%", "100%"],
          };

          // Mock reviews
          const mockReviews = [
            {
              id: "1",
              user: "Nguyễn Văn A",
              rating: 5,
              comment: "Thức uống ngon, ship nhanh!",
              date: "20/03/2023",
            },
            {
              id: "2",
              user: "Trần Thị B",
              rating: 4,
              comment: "Đồ uống ngon, nhưng đá hơi nhiều.",
              date: "15/03/2023",
            },
          ];

          setDrink(mockDrink);
          setReviews(mockReviews);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching drink details:", error);
        setLoading(false);
      }
    };

    fetchDrink();
  }, [drinkId]);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIceChange = (ice) => {
    setSelectedIce(ice);
  };

  const handleSugarChange = (sugar) => {
    setSelectedSugar(sugar);
  };

  const getCurrentPrice = () => {
    if (!drink) return 0;
    const sizePrice =
      drink.sizes.find((size) => size.name === selectedSize)?.price ||
      drink.price;
    return sizePrice;
  };

  const getTotalPrice = () => {
    return getCurrentPrice() * quantity;
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const addToCart = () => {
    const cartItem = {
      id: drink.id,
      name: drink.name,
      price: getCurrentPrice(),
      quantity: quantity,
      size: selectedSize,
      ice: selectedIce,
      sugar: selectedSugar,
      totalPrice: getTotalPrice(),
      image: drink.image,
    };

    console.log("Adding to cart:", cartItem);

    Alert.alert(
      "Thêm vào giỏ hàng",
      `Đã thêm ${quantity} ${drink.name} vào giỏ hàng`,
      [
        { text: "Tiếp tục mua hàng", style: "cancel" },
        { text: "Xem giỏ hàng", onPress: () => navigation.navigate("CartTab") },
      ]
    );
  };

  const handleStarRating = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = () => {
    if (newReview.rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!newReview.comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    const review = {
      id: Date.now().toString(),
      user: "Nguyễn Thành Đạt", // This would come from user data in a real app
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: "" });
    setShowReviewForm(false);
    Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cafe-outline" size={64} color="#CCC" />
        <Text style={styles.errorText}>Không tìm thấy thông tin đồ uống</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Drink Image */}
      <Image source={drink.image} style={styles.drinkImage} />

      {/* Drink Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.drinkName}>{drink.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {drink.rating} ({reviews.length} đánh giá)
          </Text>
        </View>
        <Text style={styles.drinkPrice}>{formatPrice(getCurrentPrice())}</Text>
        <Text style={styles.description}>{drink.description}</Text>
      </View>

      {/* Ingredients */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Thành phần</Text>
        <View style={styles.ingredientsContainer}>
          {drink.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={16} color="#8B4513" />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Size Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kích cỡ</Text>
        <View style={styles.optionsContainer}>
          {drink.sizes.map((size) => (
            <TouchableOpacity
              key={size.name}
              style={[
                styles.optionButton,
                selectedSize === size.name && styles.optionButtonActive,
              ]}
              onPress={() => handleSizeChange(size.name)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSize === size.name && styles.optionTextActive,
                ]}
              >
                {size.name}
              </Text>
              <Text
                style={[
                  styles.optionPriceText,
                  selectedSize === size.name && styles.optionTextActive,
                ]}
              >
                {formatPrice(size.price)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ice Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Mức đá</Text>
        <View style={styles.optionsContainer}>
          {drink.iceOptions.map((ice) => (
            <TouchableOpacity
              key={ice}
              style={[
                styles.optionButton,
                selectedIce === ice && styles.optionButtonActive,
              ]}
              onPress={() => handleIceChange(ice)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedIce === ice && styles.optionTextActive,
                ]}
              >
                {ice}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sugar Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Độ ngọt</Text>
        <View style={styles.optionsContainer}>
          {drink.sugarOptions.map((sugar) => (
            <TouchableOpacity
              key={sugar}
              style={[
                styles.optionButton,
                selectedSugar === sugar && styles.optionButtonActive,
              ]}
              onPress={() => handleSugarChange(sugar)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSugar === sugar && styles.optionTextActive,
                ]}
              >
                {sugar}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quantity Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Số lượng</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={20}
              color={quantity <= 1 ? "#CCC" : "#333"}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Ionicons
              name="add"
              size={20}
              color={quantity >= 10 ? "#CCC" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews */}
      <View style={styles.sectionContainer}>
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Đánh giá ({reviews.length})</Text>
          <TouchableOpacity onPress={() => setShowReviewForm(!showReviewForm)}>
            <Text style={styles.viewAllText}>
              {showReviewForm ? "Hủy" : "Viết đánh giá"}
            </Text>
          </TouchableOpacity>
        </View>

        {showReviewForm && (
          <View style={styles.reviewForm}>
            <Text style={styles.reviewFormTitle}>Đánh giá của bạn</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarRating(star)}
                >
                  <Ionicons
                    name={star <= newReview.rating ? "star" : "star-outline"}
                    size={28}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Nhập đánh giá của bạn..."
              multiline
              numberOfLines={4}
              value={newReview.comment}
              onChangeText={(text) =>
                setNewReview({ ...newReview, comment: text })
              }
            />
            <TouchableOpacity
              style={styles.submitReviewButton}
              onPress={submitReview}
            >
              <Text style={styles.submitReviewButtonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        )}

        {reviews.length === 0 && !showReviewForm ? (
          <Text style={styles.noReviewsText}>Chưa có đánh giá nào</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={star <= review.rating ? "#FFD700" : "#E0E0E0"}
                  />
                ))}
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </View>

      {/* Add to Cart Button */}
      <View style={styles.footerContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Ionicons name="cart" size={20} color="#FFF" />
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  drinkImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  drinkName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  drinkPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    lineHeight: 20,
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
    marginBottom: 10,
    minWidth: 60,
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#8B4513",
  },
  optionText: {
    fontSize: 14,
    color: "#666",
  },
  optionTextActive: {
    color: "#FFF",
  },
  optionPriceText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#8B4513",
  },
  reviewItem: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  ratingStars: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
  },
  addToCartButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
  reviewForm: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    textAlignVertical: "top",
    minHeight: 100,
    backgroundColor: "#FFF",
  },
  submitReviewButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  submitReviewButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  noReviewsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 12,
  },
});

export default DrinkDetailScreen;
