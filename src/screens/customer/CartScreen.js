import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return require('../../assets/images/icon.png');
    default:
      return require('../../assets/images/default.png');
  }
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {
    try {
      const cartString = await AsyncStorage.getItem('cart');
      if (cartString) {
        const cart = JSON.parse(cartString);
        setCartItems(cart);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
    }
  };

  useEffect(() => {
    const unsubscribe = loadCart();
    return () => unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={getImageSource(item.image)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Giỏ hàng trống</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', marginBottom: 15 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { marginLeft: 15, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#8B4513' },
  quantity: { fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default CartScreen;
