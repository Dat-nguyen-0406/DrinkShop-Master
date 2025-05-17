// src/screens/customer/SearchScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data - Thay thế bằng API thực tế sau này
const mockDrinks = [
  { 
    id: '1', 
    name: 'Cà phê đen', 
    price: 25000, 
    category: 'Cà phê', 
    rating: 4.8, 
    image: 'coffee',
    description: 'Cà phê đen truyền thống đậm đà hương vị Việt Nam'
  },
  { 
    id: '2', 
    name: 'Cà phê sữa', 
    price: 30000, 
    category: 'Cà phê', 
    rating: 4.9, 
    image: 'coffee',
    description: 'Cà phê sữa thơm béo, đậm đà'
  },
  { 
    id: '3', 
    name: 'Trà sữa truyền thống', 
    price: 35000, 
    category: 'Trà sữa', 
    rating: 4.7, 
    image: 'tea',
    description: 'Trà sữa ngọt ngào với trân châu đen dẻo dai'
  },
  { 
    id: '4', 
    name: 'Trà sữa matcha', 
    price: 40000, 
    category: 'Trà sữa', 
    rating: 4.6, 
    image: 'tea',
    description: 'Trà sữa vị matcha Nhật Bản thơm ngon'
  },
  { 
    id: '5', 
    name: 'Nước ép cam', 
    price: 35000, 
    category: 'Nước ép', 
    rating: 4.8, 
    image: 'juice',
    description: 'Nước ép cam tươi nguyên chất, giàu vitamin C'
  },
  { 
    id: '6', 
    name: 'Sinh tố dâu', 
    price: 45000, 
    category: 'Sinh tố', 
    rating: 4.9, 
    image: 'smoothie',
    description: 'Sinh tố dâu tây tươi ngọt, thơm mát'
  },
  { 
    id: '7', 
    name: 'Trà đào', 
    price: 35000, 
    category: 'Trà trái cây', 
    rating: 4.9, 
    image: 'tea',
    description: 'Trà đào thơm ngon với đào tươi ngâm'
  },
  { 
    id: '8', 
    name: 'Cappuccino', 
    price: 45000, 
    category: 'Cà phê', 
    rating: 4.7, 
    image: 'coffee',
    description: 'Cappuccino Ý với lớp foam mềm mịn'
  }
];

const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return require('../../assets/images/cafe.jpg');
    case 'tea':
      return require('../../assets/images/default.png');
    case 'juice':
      return require('../../assets/images/nuocep.jpg');
    case 'smoothie':
      return require('../../assets/images/sinhto.jpg');
    default:
      return require('../../assets/images/trasua.jpg');
  }
};

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Tải lịch sử tìm kiếm gần đây
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const searches = await AsyncStorage.getItem('recentSearches');
        if (searches) {
          setRecentSearches(JSON.parse(searches));
        }
      } catch (error) {
        console.log('Lỗi khi tải lịch sử tìm kiếm:', error);
      }
    };

    loadRecentSearches();
  }, []);

  // Lưu lịch sử tìm kiếm
  const saveSearch = async (query) => {
    try {
      let searches = [...recentSearches];
      // Nếu đã có từ khóa này rồi, xóa nó đi
      searches = searches.filter(item => item !== query);
      // Thêm từ khóa mới vào đầu danh sách
      searches.unshift(query);
      // Chỉ giữ tối đa 5 từ khóa gần đây
      searches = searches.slice(0, 5);
      
      setRecentSearches(searches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.log('Lỗi khi lưu lịch sử tìm kiếm:', error);
    }
  };

  // Xóa tất cả lịch sử tìm kiếm
  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recentSearches');
    } catch (error) {
      console.log('Lỗi khi xóa lịch sử tìm kiếm:', error);
    }
  };

  // Hàm tìm kiếm
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Giả lập tìm kiếm (thay thế bằng API thực tế sau này)
    setTimeout(() => {
      // Lọc theo từ khóa tìm kiếm
      let results = mockDrinks.filter(drink => 
        drink.name.toLowerCase().includes(query.toLowerCase()) ||
        drink.category.toLowerCase().includes(query.toLowerCase()) ||
        drink.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Lọc theo danh mục
      if (activeFilter !== 'all') {
        results = results.filter(drink => drink.category.toLowerCase() === activeFilter.toLowerCase());
      }
      
      // Lọc theo giá
      if (priceRange !== 'all') {
        switch(priceRange) {
          case 'under30k':
            results = results.filter(drink => drink.price < 30000);
            break;
          case '30k-40k':
            results = results.filter(drink => drink.price >= 30000 && drink.price <= 40000);
            break;
          case 'over40k':
            results = results.filter(drink => drink.price > 40000);
            break;
        }
      }
      
      setSearchResults(results);
      setLoading(false);
      
      // Lưu lịch sử tìm kiếm khi có từ khóa hợp lệ
      if (query.trim()) {
        saveSearch(query);
      }
    }, 500);
  };

  // Xử lý khi người dùng nhấn vào đồ uống
  const handleDrinkPress = (drink) => {
    navigation.navigate('DrinkDetail', { drink });
  };

  // Xử lý khi người dùng nhấn vào từ khóa tìm kiếm gần đây
  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Hiển thị từng món đồ uống
  const renderDrinkItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.drinkItem}
      onPress={() => handleDrinkPress(item)}
    >
      <Image source={getImageSource(item.image)} style={styles.drinkImage} />
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <Text style={styles.drinkCategory}>{item.category}</Text>
        <View style={styles.drinkBottom}>
          <Text style={styles.drinkPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Hiển thị từ khóa tìm kiếm gần đây
  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity 
      style={styles.recentSearchItem} 
      onPress={() => handleRecentSearchPress(item)}
    >
      <Ionicons name="time-outline" size={18} color="#777777" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đồ uống..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#777777" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={24} color="#8B4513" />
        </TouchableOpacity>
      </View>

      {/* Phần bộ lọc */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Danh mục:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                activeFilter === 'all' && styles.categoryButtonActive
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[
                styles.categoryButtonText,
                activeFilter === 'all' && styles.categoryButtonTextActive
              ]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                activeFilter === 'cà phê' && styles.categoryButtonActive
              ]}
              onPress={() => setActiveFilter('cà phê')}
            >
              <Text style={[
                styles.categoryButtonText,
                activeFilter === 'cà phê' && styles.categoryButtonTextActive
              ]}>Cà phê</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                activeFilter === 'trà sữa' && styles.categoryButtonActive
              ]}
              onPress={() => setActiveFilter('trà sữa')}
            >
              <Text style={[
                styles.categoryButtonText,
                activeFilter === 'trà sữa' && styles.categoryButtonTextActive
              ]}>Trà sữa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                activeFilter === 'nước ép' && styles.categoryButtonActive
              ]}
              onPress={() => setActiveFilter('nước ép')}
            >
              <Text style={[
                styles.categoryButtonText,
                activeFilter === 'nước ép' && styles.categoryButtonTextActive
              ]}>Nước ép</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                activeFilter === 'trà trái cây' && styles.categoryButtonActive
              ]}
              onPress={() => setActiveFilter('trà trái cây')}
            >
              <Text style={[
                styles.categoryButtonText,
                activeFilter === 'trà trái cây' && styles.categoryButtonTextActive
              ]}>Trà trái cây</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.filterTitle}>Giá:</Text>
          <View style={styles.priceFilters}>
            <TouchableOpacity 
              style={[
                styles.priceButton,
                priceRange === 'all' && styles.priceButtonActive
              ]}
              onPress={() => setPriceRange('all')}
            >
              <Text style={[
                styles.priceButtonText,
                priceRange === 'all' && styles.priceButtonTextActive
              ]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.priceButton,
                priceRange === 'under30k' && styles.priceButtonActive
              ]}
              onPress={() => setPriceRange('under30k')}
            >
              <Text style={[
                styles.priceButtonText,
                priceRange === 'under30k' && styles.priceButtonTextActive
              ]}>Dưới 30k</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.priceButton,
                priceRange === '30k-40k' && styles.priceButtonActive
              ]}
              onPress={() => setPriceRange('30k-40k')}
            >
              <Text style={[
                styles.priceButtonText,
                priceRange === '30k-40k' && styles.priceButtonTextActive
              ]}>30k - 40k</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.priceButton,
                priceRange === 'over40k' && styles.priceButtonActive
              ]}
              onPress={() => setPriceRange('over40k')}
            >
              <Text style={[
                styles.priceButtonText,
                priceRange === 'over40k' && styles.priceButtonTextActive
              ]}>Trên 40k</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.applyFilterButton}
            onPress={() => {
              handleSearch(searchQuery);
              setShowFilters(false);
            }}
          >
            <Text style={styles.applyFilterText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Phần nội dung chính */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderDrinkItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.searchResultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={60} color="#CCCCCC" />
          <Text style={styles.noResultsText}>Không tìm thấy kết quả nào</Text>
          <Text style={styles.noResultsSubText}>Hãy thử với từ khóa khác</Text>
        </View>
      ) : (
        <View style={styles.recentSearchesContainer}>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>Tìm kiếm gần đây</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            )}
          </View>
          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearch}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.recentSearchesList}
            />
          ) : (
            <Text style={styles.noRecentSearches}>Chưa có tìm kiếm nào gần đây</Text>
          )}

          <View style={styles.popularSearchesContainer}>
            <Text style={styles.popularSearchesTitle}>Phổ biến</Text>
            <View style={styles.popularTagsContainer}>
              <TouchableOpacity 
                style={styles.popularTag}
                onPress={() => handleRecentSearchPress('Cà phê')}
              >
                <Text style={styles.popularTagText}>Cà phê</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.popularTag}
                onPress={() => handleRecentSearchPress('Trà sữa')}
              >
                <Text style={styles.popularTagText}>Trà sữa</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.popularTag}
                onPress={() => handleRecentSearchPress('Nước ép')}
              >
                <Text style={styles.popularTagText}>Nước ép</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.popularTag}
                onPress={() => handleRecentSearchPress('Matcha')}
              >
                <Text style={styles.popularTagText}>Matcha</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.popularTag}
                onPress={() => handleRecentSearchPress('Trà đào')}
              >
                <Text style={styles.popularTagText}>Trà đào</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  categoriesScroll: {
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  categoryButtonText: {
    color: '#555555',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  priceFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  priceButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  priceButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  priceButtonText: {
    color: '#555555',
  },
  priceButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  applyFilterButton: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#8B4513',
    fontSize: 16,
  },
  searchResultsContainer: {
    padding: 15,
  },
  drinkItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
  },
  drinkImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  drinkInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  drinkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  drinkCategory: {
    fontSize: 14,
    color: '#777777',
    marginTop: 5,
  },
  drinkBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555555',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333333',
  },
  noResultsSubText: {
    fontSize: 16,
    color: '#777777',
    marginTop: 10,
  },
  recentSearchesContainer: {
    flex: 1,
    padding: 15,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  clearAllText: {
    color: '#8B4513',
    fontSize: 14,
  },
  recentSearchesList: {
    marginBottom: 20,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recentSearchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555555',
  },
  noRecentSearches: {
    textAlign: 'center',
    color: '#777777',
    fontSize: 16,
    marginBottom: 20,
  },
  popularSearchesContainer: {
    marginTop: 20,
  },
  popularSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  popularTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularTag: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default SearchScreen;