// src/screens/customer/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const categoriesData = [
  { id: '1', name: 'Cà phê', image: require('../../assets/images/icon.png') },
  { id: '2', name: 'Trà sữa', image: require('../../assets/images/icon.png') },
  { id: '3', name: 'Nước ép', image: require('../../assets/images/icon.png') },
  { id: '4', name: 'Sinh tố', image: require('../../assets/images/icon.png') },
  { id: '5', name: 'Trà', image: require('../../assets/images/icon.png') },
];

const popularDrinksData = [
  { id: '1', name: 'Cà phê sữa đá', price: 29000, rating: 4.8, image: require('../../assets/images/icon.png') },
  { id: '2', name: 'Trà sữa trân châu', price: 35000, rating: 4.7, image: require('../../assets/images/icon.png') },
  { id: '3', name: 'Sinh tố xoài', price: 39000, rating: 4.5, image: require('../../assets/images/icon.png') },
  { id: '4', name: 'Nước ép cam', price: 32000, rating: 4.6, image: require('../../assets/images/icon.png') },
  { id: '5', name: 'Trà đào', price: 30000, rating: 4.9, image: require('../../assets/images/icon.png') },
];

const promotionsData = [
  { id: '1', image: require('../../assets/images/icon.png') },
  { id: '2', image: require('../../assets/images/icon.png') },
];

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activePromotion, setActivePromotion] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        setUserName(storedName || 'Khách');
      } catch (error) {
        console.log('Error getting user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();

    const interval = setInterval(() => {
      setActivePromotion(prev => (prev + 1) % promotionsData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('DrinkListScreen', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPopularDrinkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drinkItem}
      onPress={() => navigation.navigate('DrinkDetailScreen', { product: item })}
    >
      <Image source={item.image} style={styles.drinkImage} />
      <Text style={styles.drinkName}>{item.name}</Text>
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPromotionItem = ({ item }) => (
    <TouchableOpacity style={styles.promotionItem}>
      <Image source={item.image} style={styles.promotionImage} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.promotionContainer}>
          <FlatList
            data={promotionsData}
            renderItem={renderPromotionItem}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            initialScrollIndex={activePromotion}
          />
          <View style={styles.paginationContainer}>
            {promotionsData.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, index === activePromotion && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DrinkListScreen')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoriesData}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phổ biến</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DrinkListScreen', { filter: 'popular' })}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularDrinksData}
            renderItem={renderPopularDrinkItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.drinksList}
          />
        </View>

        <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DrinkListScreen', { filter: 'recommended' })}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularDrinksData.slice().reverse()}
            renderItem={renderPopularDrinkItem}
            keyExtractor={item => `rec-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.drinksList}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#FFFFFF'
  },
  userInfo: { flex: 1 },
  greeting: { fontSize: 14, color: '#666' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerIcons: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  promotionContainer: { height: 180, marginBottom: 20 },
  promotionItem: { width: width, height: 160, paddingHorizontal: 20 },
  promotionImage: { width: '100%', height: '100%', borderRadius: 15, resizeMode: 'cover' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CCC', marginHorizontal: 4 },
  paginationDotActive: { backgroundColor: '#8B4513' },
  sectionContainer: { marginTop: 20, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 14, color: '#8B4513' },
  categoriesList: { paddingRight: 20 },
  categoryItem: { alignItems: 'center', marginRight: 20, width: 80 },
  categoryImageContainer: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8
  },
  categoryImage: { width: 40, height: 40, resizeMode: 'contain' },
  categoryName: { fontSize: 14, color: '#333', textAlign: 'center' },
  drinksList: { paddingRight: 20 },
  drinkItem: {
    width: 150, marginRight: 15, borderRadius: 15, backgroundColor: '#F9F9F9', padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  drinkImage: { width: '100%', height: 130, borderRadius: 10, resizeMode: 'cover', marginBottom: 10 },
  drinkName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  drinkInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drinkPrice: { fontSize: 14, fontWeight: 'bold', color: '#8B4513' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#666', marginLeft: 2 },
});

export default HomeScreen;
