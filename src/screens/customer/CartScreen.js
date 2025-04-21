import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return require('../../assets/images/icon.png');
    case 'tea':
      return require('../../assets/images/default.png');
    default:
      return require('../../assets/images/default.png');
  }
};

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartString = await AsyncStorage.getItem('cart');
      if (cartString) {
        const cart = JSON.parse(cartString);
        setCartItems(cart);
        calculateTotal(cart);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    loadCart();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCart();
    });
    return unsubscribe;
  }, [navigation]);

  const updateItemQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return removeItem(id);
      }
      
      const updatedCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể cập nhật giỏ hàng');
    }
  };

  const removeItem = async (id) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== id);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng');
      return;
    }
    navigation.navigate('Checkout', { cartItems, totalPrice });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={getImageSource(item.image)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Giỏ Hàng</Text>
        {cartItems.length > 0 && (
          <Text style={styles.itemCount}>{cartItems.length} món</Text>
        )}
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
            <Text style={styles.empty}>Giỏ hàng của bạn đang trống</Text>
            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.continueShoppingText}>Tiếp tục mua sắm</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
          </View>
          
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9F9F9' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF'
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold'
  },
  itemCount: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600'
  },
  item: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 10 
  },
  info: { 
    flex: 1,
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  price: { 
    fontSize: 16, 
    color: '#8B4513',
    marginBottom: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantityValue: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600'
  },
  removeButton: {
    justifyContent: 'center',
    padding: 5
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 18,
    color: '#777777'
  },
  continueShopping: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#8B4513',
    borderRadius: 25
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600'
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513'
  },
  checkoutButton: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10
  }
});

export default CartScreen;