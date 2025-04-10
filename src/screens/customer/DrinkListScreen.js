// src/screens/customer/DrinkListScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data - in a real app, this would come from an API
const allDrinks = [
  // Cà phê
  { id: '1', name: 'Cà phê sữa đá', price: 29000, rating: 4.8, category: '1', image: require('../../assets/icon.png') },
  { id: '2', name: 'Cà phê đen đá', price: 25000, rating: 4.6, category: '1', image: require('../../assets/icon.png') },
  { id: '3', name: 'Bạc xỉu', price: 32000, rating: 4.7, category: '1', image: require('../../assets/icon.png') },
  { id: '4', name: 'Cappuccino', price: 45000, rating: 4.5, category: '1', image: require('../../assets/icon.png') },
  { id: '5', name: 'Latte', price: 49000, rating: 4.9, category: '1', image: require('../../assets/icon.png') },
  
  // Trà sữa
  { id: '6', name: 'Trà sữa trân châu', price: 35000, rating: 4.7, category: '2', image: require('../../assets/icon.png') },
  { id: '7', name: 'Trà sữa matcha', price: 38000, rating: 4.5, category: '2', image: require('../../assets/icon.png') },
  { id: '8', name: 'Trà sữa chocolate', price: 42000, rating: 4.6, category: '2', image: require('../../assets/icon.png') },
  
  // Nước ép
  { id: '9', name: 'Nước ép cam', price: 32000, rating: 4.6, category: '3', image: require('../../assets/icon.png') },
  { id: '10', name: 'Nước ép táo', price: 35000, rating: 4.4, category: '3', image: require('../../assets/icon.png') },
  { id: '11', name: 'Nước ép dứa', price: 32000, rating: 4.5, category: '3', image: require('../../assets/icon.png') },
  
  // Sinh tố
  { id: '12', name: 'Sinh tố xoài', price: 39000, rating: 4.5, category: '4', image: require('../../assets/icon.png') },
  { id: '13', name: 'Sinh tố bơ', price: 45000, rating: 4.8, category: '4', image: require('../../assets/icon.png') },
  { id: '14', name: 'Sinh tố dâu', price: 42000, rating: 4.7, category: '4', image: require('../../assets/icon.png') },
  
  // Trà
  { id: '15', name: 'Trà đào', price: 30000, rating: 4.9, category: '5', image: require('../../assets/icon.png') },
  { id: '16', name: 'Trà chanh', price: 25000, rating: 4.5, category: '5', image: require('../../assets/icon.png') },
  { id: '17', name: 'Trà gừng', price: 28000, rating: 4.3, category: '5', image: require('../../assets/icon.png') },
  { id: '18', name: 'Trà hoa cúc', price: 32000, rating: 4.6, category: '5', image: require('../../assets/icon.png') },
];

const DrinkListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, filter } = route.params || {};
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filters
  const filterOptions = [
    { id: 'all', name: 'Tất cả' },
    { id: 'popular', name: 'Phổ biến' },
    { id: 'price_low', name: 'Giá thấp - cao' },
    { id: 'price_high', name: 'Giá cao - thấp' },
    { id: 'rating', name: 'Đánh giá' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filteredData = [...allDrinks];
      
      // Filter by category if provided
      if (categoryId) {
        filteredData = filteredData.filter(drink => drink.category === categoryId);
      }
      
      // Set initial filter if provided in route
      if (filter === 'popular') {
        setActiveFilter('popular');
        filteredData.sort((a, b) => b.rating - a.rating);
      } else if (filter === 'recommended') {
        // For demo, we'll just shuffle the array to simulate recommendations
        filteredData.sort(() => Math.random() - 0.5);
      }
      
      setDrinks(filteredData);
      setFilteredDrinks(filteredData);
      setIsLoading(false);
    }, 1000);
  }, [categoryId, filter]);

  // Apply filters and search
  useEffect(() => {
    let result = [...drinks];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(drink => 
        drink.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply active filter
    switch (activeFilter) {
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep default order
        break;
    }
    
    setFilteredDrinks(result);
  }, [drinks, searchQuery, activeFilter]);

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        activeFilter === item.id && styles.filterItemActive
      ]}
      onPress={() => setActiveFilter(item.id)}
    >
      <Text 
        style={[
          styles.filterText,
          activeFilter === item.id && styles.filterTextActive
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderDrinkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drinkItem}
      onPress={() => navigation.navigate('DrinkDetail', { drinkId: item.id })}
    >
      <Image source={item.image} style={styles.drinkImage} />
      <View style={styles.drinkContent}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.drinkPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          // In a real app, dispatch to cart
          alert(`Đã thêm ${item.name} vào giỏ hàng`);
        }}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || 'Tất cả đồ uống'}</Text>
        <View style={styles.emptyView} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm đồ uống..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filterOptions}
          renderItem={renderFilterItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {/* Drink List */}
      {filteredDrinks.length > 0 ? (
        <FlatList
          data={filteredDrinks}
          renderItem={renderDrinkItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.drinksList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cafe-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>Không tìm thấy đồ uống nào</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyView: {
    width: 34,  // Same width as backButton for balance
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 5,
    fontSize: 14,
    marginLeft: -30,  // Overlay the icon
  },
  clearButton: {
    marginLeft: -30,
    padding: 5,
  },
  filtersContainer: {
    paddingVertical: 10,
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  filterItemActive: {
    backgroundColor: '#8B4513',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  drinksList: {
    padding: 20,
  },
  drinkItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  drinkImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  drinkContent: {
    flex: 1,
    justifyContent: 'center',
  },
  drinkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default DrinkListScreen;