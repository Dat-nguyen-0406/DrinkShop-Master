import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CoffeeImage from '../../assets/images/icon.png';

const DrinkDetailScreen = ({ navigation, route }) => {
  const { drinkId } = route.params;
  const [drink, setDrink] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrinkDetail = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const drinkDetail = {
        id: drinkId,
        name: 'Cà Phê Sữa',
        price: 35000,
        description: 'Cà phê đậm đà pha với sữa đặc, thơm ngon đúng điệu',
        ingredients: ['Cà phê', 'Sữa đặc', 'Đường'],
        category: 'Cà phê',
        image: CoffeeImage,
        imageName: 'coffee',
        rating: 4.5,
        reviews: 120
      };

      setDrink(drinkDetail);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin đồ uống');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrinkDetail();
  }, [drinkId]);

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(q => q - 1);

  const addToCart = async () => {
    try {
      setIsLoading(true);
      const cartString = await AsyncStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];

      const index = cart.findIndex(item => item.id === drink.id);
      if (index !== -1) {
        cart[index].quantity += quantity;
      } else {
        cart.push({
          id: drink.id,
          name: drink.name,
          price: drink.price,
          image: drink.imageName, // Lưu tên ảnh thay vì require
          quantity
        });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !drink) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy đồ uống</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff' }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={drink.image} style={styles.image} />
      <Text style={styles.name}>{drink.name}</Text>
      <Text style={styles.price}>{drink.price.toLocaleString('vi-VN')} đ</Text>
      <Text style={styles.rating}>
        {'★'.repeat(Math.floor(drink.rating))}{'☆'.repeat(5 - Math.floor(drink.rating))} ({drink.reviews} đánh giá)
      </Text>

      <Text style={styles.heading}>Mô tả</Text>
      <Text style={styles.text}>{drink.description}</Text>

      <Text style={styles.heading}>Thành phần</Text>
      {drink.ingredients.map((item, i) => (
        <Text key={i} style={styles.text}>• {item}</Text>
      ))}

      <View style={styles.quantityRow}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyBtn}><Text style={styles.btnText}>-</Text></TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity onPress={increaseQuantity} style={styles.qtyBtn}><Text style={styles.btnText}>+</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={addToCart} style={styles.cartBtn}>
        <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 20, color: '#8B4513', marginBottom: 5 },
  rating: { fontSize: 16, marginBottom: 15 },
  heading: { fontSize: 18, fontWeight: '600', marginTop: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  qtyBtn: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5
  },
  btnText: { color: '#fff', fontSize: 18 },
  qtyText: { marginHorizontal: 20, fontSize: 18 },
  cartBtn: {
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 50,
    marginTop: 10
  },
  cartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  backBtn: {
    marginTop: 15,
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5
  }
});

export default DrinkDetailScreen;
