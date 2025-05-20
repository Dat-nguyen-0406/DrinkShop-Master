import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Mock data for a single drink, replace with actual API call later
const mockDrinksData = [
  {
    id: '1',
    name: 'Cà Phê Sữa Đá',
    price: 35000,
    image: 'coffee', // Use image name to resolve path in getImageSource
    rating: 4.5,
    reviewsCount: 120,
    description: 'Cà phê đậm đà pha với sữa đặc và đá, mang lại hương vị truyền thống của Việt Nam. Thức uống lý tưởng để bắt đầu ngày mới hoặc nạp năng lượng buổi chiều.',
    sizes: ['S', 'M', 'L'],
    iceOptions: ['0%', '30%', '50%', '70%', '100%'],
    sugarOptions: ['0%', '30%', '50%', '70%', '100%'],
  },
  {
    id: '2',
    name: 'Trà Sữa Trân Châu Đường Đen',
    price: 45000,
    image: 'tea', // Use image name
    rating: 4.8,
    reviewsCount: 95,
    description: 'Trà sữa thơm lừng với vị ngọt dịu của đường đen và trân châu dai mềm. Một lựa lý tưởng cho những ai yêu thích hương vị trà sữa đậm đà.',
    sizes: ['M', 'L'],
    iceOptions: ['0%', '50%', '70%', '100%'],
    sugarOptions: ['0%', '50%', '70%', '100%'],
  },
  {
    id: '3',
    name: 'Nước Ép Cam Tươi',
    price: 40000,
    image: 'default', // Use image name
    rating: 4.2,
    reviewsCount: 78,
    description: 'Nước cam tươi 100% nguyên chất, giàu vitamin C. Giúp tăng cường sức đề kháng và mang lại cảm giác sảng khoái.',
    sizes: ['M', 'L'],
    iceOptions: ['0%', '50%', '70%', '100%'],
    sugarOptions: ['0%', '100%'],
  },
  // Add more mock drinks as needed
];

// Re-using getImageSource from CartScreen for consistency
const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return require('../../assets/images/cafe.jpg');
    case 'tea':
      return require('../../assets/images/trasua.jpg'); // Assuming you have a trasua.jpg for tea
    default:
      return require('../../assets/images/default.png');
  }
};


const DrinkDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { drinkId } = route.params;

  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M'); // Default size
  const [selectedIce, setSelectedIce] = useState('100%'); // Default ice
  const [selectedSugar, setSelectedSugar] = useState('100%'); // Default sugar
  const [reviews, setReviews] = useState([
    { id: '1', user: 'Nguyễn Văn A', rating: 5, comment: 'Thức uống ngon, ship nhanh!', date: '20/03/2023' },
    { id: '2', user: 'Trần Thị B', rating: 4, comment: 'Đồ uống ngon, nhưng đá hơi nhiều.', date: '15/03/2023' },
    { id: '3', user: 'Lê Văn C', rating: 5, comment: 'Tuyệt vời, sẽ ủng hộ dài dài.', date: '10/03/2023' },
  ]);


  useEffect(() => {
    // Simulate fetching drink data
    const fetchDrink = async () => {
      setLoading(true);
      // In a real app, you'd make an API call here:
      // const response = await axios.get(`${API_URL}/drinks/${drinkId}`);
      // setDrink(response.data);
      const foundDrink = mockDrinksData.find(d => d.id === drinkId);
      if (foundDrink) {
        setDrink(foundDrink);
        // Set default options if available
        setSelectedSize(foundDrink.sizes && foundDrink.sizes.length > 0 ? foundDrink.sizes[0] : 'M');
        setSelectedIce(foundDrink.iceOptions && foundDrink.iceOptions.length > 0 ? foundDrink.iceOptions[foundDrink.iceOptions.length - 1] : '100%');
        setSelectedSugar(foundDrink.sugarOptions && foundDrink.sugarOptions.length > 0 ? foundDrink.sugarOptions[foundDrink.sugarOptions.length - 1] : '100%');
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy đồ uống.');
        navigation.goBack(); // Go back if drink not found
      }
      setLoading(false);
    };

    fetchDrink();
  }, [drinkId]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!drink) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
      return;
    }

    const newItem = {
      id: `${drink.id}-${selectedSize}-${selectedIce}-${selectedSugar}`, // Unique ID for item with options
      drinkId: drink.id, // Original drink ID
      name: drink.name,
      price: drink.price,
      quantity: quantity,
      image: drink.image, // Use the image name for consistency
      size: selectedSize,
      ice: selectedIce,
      sugar: selectedSugar,
    };

    try {
      const existingCartString = await AsyncStorage.getItem('cart');
      let cart = existingCartString ? JSON.parse(existingCartString) : [];

      const existingItemIndex = cart.findIndex(item =>
        item.drinkId === newItem.drinkId &&
        item.size === newItem.size &&
        item.ice === newItem.ice &&
        item.sugar === newItem.sugar
      );

      if (existingItemIndex > -1) {
        // Item with same options exists, update quantity
        cart[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Add new item to cart
        cart.push(newItem);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Thông báo', `Đã thêm ${quantity} x ${drink.name} vào giỏ hàng.`);
      navigation.navigate('CartTab'); // Navigate to Cart screen after adding
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
      console.error("Error adding to cart:", e);
    }
  };


  if (loading || !drink) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={getImageSource(drink.image)} style={styles.drinkImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.drinkName}>{drink.name}</Text>
          <Text style={styles.drinkPrice}>{drink.price.toLocaleString('vi-VN')} đ</Text>

          <View style={styles.ratingSection}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{drink.rating} ({drink.reviewsCount} đánh giá)</Text>
          </View>

          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>{drink.description}</Text>

          {/* Size Options */}
          {drink.sizes && drink.sizes.length > 0 && (
            <View style={styles.optionsSection}>
              <Text style={styles.sectionTitle}>Kích cỡ</Text>
              <View style={styles.optionsRow}>
                {drink.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.selectedOptionButton,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.selectedOptionText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Ice Options */}
          {drink.iceOptions && drink.iceOptions.length > 0 && (
            <View style={styles.optionsSection}>
              <Text style={styles.sectionTitle}>Đá</Text>
              <View style={styles.optionsRow}>
                {drink.iceOptions.map((ice) => (
                  <TouchableOpacity
                    key={ice}
                    style={[
                      styles.optionButton,
                      selectedIce === ice && styles.selectedOptionButton,
                    ]}
                    onPress={() => setSelectedIce(ice)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedIce === ice && styles.selectedOptionText,
                      ]}
                    >
                      {ice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sugar Options */}
          {drink.sugarOptions && drink.sugarOptions.length > 0 && (
            <View style={styles.optionsSection}>
              <Text style={styles.sectionTitle}>Đường</Text>
              <View style={styles.optionsRow}>
                {drink.sugarOptions.map((sugar) => (
                  <TouchableOpacity
                    key={sugar}
                    style={[
                      styles.optionButton,
                      selectedSugar === sugar && styles.selectedOptionButton,
                    ]}
                    onPress={() => setSelectedSugar(sugar)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSugar === sugar && styles.selectedOptionText,
                      ]}
                    >
                      {sugar}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}


          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Số lượng</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
                <Ionicons name="remove-outline" size={24} color="#8B4513" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
                <Ionicons name="add-outline" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.reviewSection}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Đánh giá ({reviews.length})</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.ratingStars}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer with Add to Cart Button */}
      <View style={styles.footerContainer}>
        <View style={styles.priceTotal}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{(drink.price * quantity).toLocaleString('vi-VN')} đ</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollViewContent: {
    paddingBottom: 100, // Make space for the fixed footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  drinkImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Overlap with image slightly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  drinkName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  drinkPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
  },
  optionsSection: {
    marginBottom: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow options to wrap to the next line
    gap: 10, // Space between items
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F0F0F0',
  },
  selectedOptionButton: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  optionText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 20, // Ensure enough space for numbers
    textAlign: 'center',
  },
  reviewSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  reviewItem: {
    backgroundColor: '#FDFDFD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end', // Align date to the right
    marginTop: 5,
  },
  ratingStars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // Higher elevation for the footer
  },
  priceTotal: {
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addToCartButton: {
    backgroundColor: '#8B4513',
    borderRadius: 30, // Make it pill-shaped
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180, // Ensure enough width
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DrinkDetailScreen;