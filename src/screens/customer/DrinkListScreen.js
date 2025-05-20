import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CoffeeImage from '../../assets/images/cafe.jpg';
import TeaImage from '../../assets/images/trasua.jpg'; // Assuming you have a 'trasua.jpg'
import DefaultImage from '../../assets/images/default.png'; // Assuming you have a 'default.png'

const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return CoffeeImage;
    case 'tea':
      return TeaImage;
    case 'default':
      return DefaultImage;
    default:
      return DefaultImage;
  }
};

const drinks = [
  {
    id: '1', // Changed to string for consistency with mockDrinks in SearchScreen
    name: 'Cà Phê Sữa',
    price: 35000,
    imageName: 'coffee', // Use imageName to get source from getImageSource
    rating: 4.5,
    reviews: 120,
    description: 'Cà phê đậm đà pha với sữa đặc tạo nên hương vị truyền thống thơm ngon.',
    ingredients: ['Cà phê', 'Sữa đặc'],
    category: 'Cà phê'
  },
  {
    id: '2',
    name: 'Cà Phê Đen Đá',
    price: 25000,
    imageName: 'coffee',
    rating: 4.7,
    reviews: 95,
    description: 'Cà phê đen nguyên chất, pha phin truyền thống, thêm đá mát lạnh.',
    ingredients: ['Cà phê', 'Đá'],
    category: 'Cà phê'
  },
  {
    id: '3',
    name: 'Trà Sữa Trân Châu Đường Đen',
    price: 40000,
    imageName: 'tea',
    rating: 4.8,
    reviews: 200,
    description: 'Trà sữa thơm béo kết hợp trân châu đường đen dai ngon.',
    ingredients: ['Trà', 'Sữa', 'Trân châu đường đen'],
    category: 'Trà sữa'
  },
  {
    id: '4',
    name: 'Trà Đào Cam Sả',
    price: 38000,
    imageName: 'tea',
    rating: 4.6,
    reviews: 150,
    description: 'Vị đào thanh mát, cam tươi và hương sả thơm lừng.',
    ingredients: ['Trà', 'Đào', 'Cam', 'Sả'],
    category: 'Trà'
  },
  {
    id: '5',
    name: 'Nước Ép Cam Tươi',
    price: 42000,
    imageName: 'default',
    rating: 4.9,
    reviews: 180,
    description: 'Nước ép cam tươi 100%, giàu vitamin C, tốt cho sức khỏe.',
    ingredients: ['Cam tươi'],
    category: 'Nước ép'
  },
  {
    id: '6',
    name: 'Nước Ép Dứa',
    price: 38000,
    imageName: 'default',
    rating: 4.4,
    reviews: 70,
    description: 'Nước ép dứa chua ngọt tự nhiên, giải khát hiệu quả.',
    ingredients: ['Dứa tươi'],
    category: 'Nước ép'
  },
  {
    id: '7',
    name: 'Sinh Tố Bơ',
    price: 45000,
    imageName: 'default',
    rating: 4.7,
    reviews: 110,
    description: 'Sinh tố bơ sánh mịn, thơm ngon, bổ dưỡng.',
    ingredients: ['Bơ', 'Sữa tươi', 'Sữa đặc'],
    category: 'Sinh tố'
  },
  {
    id: '8',
    name: 'Sinh Tố Xoài',
    price: 43000,
    imageName: 'default',
    rating: 4.6,
    reviews: 85,
    description: 'Sinh tố xoài ngọt ngào, mát lạnh, vị xoài đậm đà.',
    ingredients: ['Xoài', 'Sữa chua', 'Đá'],
    category: 'Sinh tố'
  },
  {
    id: '9',
    name: 'Latte Đá',
    price: 48000,
    imageName: 'coffee',
    rating: 4.7,
    reviews: 130,
    description: 'Cà phê espresso và sữa tươi đánh nóng, thêm đá.',
    ingredients: ['Espresso', 'Sữa tươi', 'Đá'],
    category: 'Cà phê'
  },
  {
    id: '10',
    name: 'Matcha Latte',
    price: 50000,
    imageName: 'tea',
    rating: 4.9,
    reviews: 160,
    description: 'Trà xanh Matcha cao cấp hòa quyện với sữa tươi béo ngậy.',
    ingredients: ['Matcha', 'Sữa tươi'],
    category: 'Trà'
  },
];

const DrinkListScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DrinkDetail', { drinkId: item.id })}
    >
      <Image source={getImageSource(item.imageName)} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        // FIX: Wrap the string in a <Text> component
        ListEmptyComponent={<Text style={styles.noDrinksText}>Không có đồ uống nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Lighter background
  },
  list: {
    padding: 10,
    // Add some padding to the bottom if needed for full scrollability
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White card background
    margin: 8, // Reduced margin for a tighter grid
    borderRadius: 12, // Slightly larger border radius
    alignItems: 'center',
    padding: 15, // Increased padding inside card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  image: {
    width: '100%', // Make image fill card width
    height: 120, // Taller image
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover', // Ensure image covers the area
  },
  name: {
    fontSize: 15, // Slightly smaller font for name
    fontWeight: 'bold',
    color: '#333333', // Darker text color
    textAlign: 'center', // Center text
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#8B4513', // Your theme color
    fontWeight: '600',
  },
  noDrinksText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777777',
  },
});

export default DrinkListScreen;
