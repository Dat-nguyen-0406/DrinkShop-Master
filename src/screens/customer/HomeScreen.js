import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
//import axios from 'axios';
//import { API_URL } from '../../utils/config';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([
    { id: '1', name: 'Cà phê', image: require('../../assets/images/icon.png') },
    { id: '2', name: 'Trà sữa', image: require('../../assets/images/icon.png') },
    { id: '3', name: 'Nước ép', image: require('../../assets/images/icon.png') },
    { id: '4', name: 'Đá xay', image: require('../../assets/images/icon.png') },
  ]);
  
  const [featuredDrinks, setFeaturedDrinks] = useState([
    { 
      id: '1', 
      name: 'Cà phê sữa đá', 
      image: require('../../assets/images/icon.png'),
      price: 29000,
      rating: 4.8
    },
    { 
      id: '2', 
      name: 'Trà sữa trân châu', 
      image: require('../../assets/images/icon.png'),
      price: 35000,
      rating: 4.6
    },
    { 
      id: '3', 
      name: 'Nước cam tươi', 
      image: require('../../assets/images/icon.png'),
      price: 32000,
      rating: 4.5
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  
  // For actual implementation, you would fetch data from API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const categoryResponse = await axios.get(`${API_URL}/categories`);
  //       setCategories(categoryResponse.data);
  //       
  //       const featuredResponse = await axios.get(`${API_URL}/drinks/featured`);
  //       setFeaturedDrinks(featuredResponse.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchData();
  // }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('DrinkList', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredItem}
      onPress={() => navigation.navigate('DrinkDetail', { drinkId: item.id })}
    >
      <Image source={item.image} style={styles.featuredImage} />
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredPrice}>{formatPrice(item.price)}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Cà phê chất lượng</Text>
          <Text style={styles.bannerSubtitle}>Cho ngày mới tràn đầy năng lượng</Text>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Featured Drinks Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đồ uống nổi bật</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DrinkList')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredDrinks}
          renderItem={renderFeaturedItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Promotions Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khuyến mãi</Text>
        </View>
        <TouchableOpacity style={styles.promotionCard}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.promotionImage}
          />
          <View style={styles.promotionContent}>
            <Text style={styles.promotionTitle}>Giảm 20%</Text>
            <Text style={styles.promotionDescription}>Cho đơn hàng đầu tiên</Text>
            <View style={styles.promotionButton}>
              <Text style={styles.promotionButtonText}>Đặt ngay</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B4513',
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 80,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  featuredItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  promotionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  promotionImage: {
    width: 100,
    height: '100%',
  },
  promotionContent: {
    flex: 1,
    padding: 16,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  promotionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  promotionButton: {
    backgroundColor: '#8B4513',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  promotionButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default HomeScreen;