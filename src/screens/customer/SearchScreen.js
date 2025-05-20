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
  ScrollView // Keep ScrollView if you intend to wrap content that might overflow
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
    rating: 4.5,
    image: 'tea',
    description: 'Trà sữa pha chế theo công thức truyền thống, thơm ngon'
  },
  {
    id: '4',
    name: 'Nước ép cam',
    price: 40000,
    category: 'Nước ép',
    rating: 4.7,
    image: 'default',
    description: 'Nước ép cam tươi mát, giàu vitamin C'
  },
  {
    id: '5',
    name: 'Sinh tố bơ',
    price: 45000,
    category: 'Đá xay',
    rating: 4.6,
    image: 'default',
    description: 'Sinh tố bơ thơm ngon, bổ dưỡng'
  },
  {
    id: '6',
    name: 'Cà phê trứng',
    price: 45000,
    category: 'Cà phê',
    rating: 4.7,
    image: 'coffee',
    description: 'Cà phê trứng béo ngậy'
  },
  {
    id: '7',
    name: 'Trà đào cam sả',
    price: 40000,
    category: 'Trà', // Added 'Trà' category for diversity
    rating: 4.6,
    image: 'tea',
    description: 'Trà đào cam sả thơm mát'
  },
  {
    id: '8',
    name: 'Nước ép dứa',
    price: 38000,
    category: 'Nước ép',
    rating: 4.5,
    image: 'default',
    description: 'Nước ép dứa tươi ngon'
  },
  {
    id: '9',
    name: 'Sinh tố xoài',
    price: 42000,
    category: 'Sinh tố', // Changed from 'Đá xay' to 'Sinh tố' for more specific category name
    rating: 4.7,
    image: 'default',
    description: 'Sinh tố xoài ngọt ngào'
  },
];

const getImageSource = (imageName) => {
  switch (imageName) {
    case 'coffee':
      return require('../../assets/images/cafe.jpg');
    case 'tea':
      return require('../../assets/images/trasua.jpg'); // Assuming you have a 'trasua.jpg'
    case 'default':
      return require('../../assets/images/default.png');
    default:
      return require('../../assets/images/default.png');
  }
};

const quickSearchKeywords = ['Cà phê', 'Trà sữa', 'Nước ép', 'Sinh tố']; // Define your quick search keywords

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    // Perform search immediately when searchQuery changes
    if (searchQuery.length > 0) {
      handleSearch(searchQuery); // Pass searchQuery to handleSearch
      setShowRecentSearches(false); // Hide recent searches when typing
    } else {
      setFilteredDrinks([]);
      setShowRecentSearches(true); // Show recent searches when search bar is empty
    }
  }, [searchQuery]); // Re-run search when searchQuery changes

  const loadRecentSearches = async () => {
    try {
      const recentSearchesString = await AsyncStorage.getItem('recentSearches');
      if (recentSearchesString) {
        setRecentSearches(JSON.parse(recentSearchesString));
      }
    } catch (e) {
      console.error('Failed to load recent searches.', e);
    }
  };

  const saveRecentSearch = async (query) => {
    try {
      let updatedSearches = [query, ...recentSearches.filter(item => item !== query)];
      updatedSearches = updatedSearches.slice(0, 5); // Keep only the last 5 searches
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (e) {
      console.error('Failed to save recent search.', e);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch (e) {
      console.error('Failed to clear recent searches.', e);
    }
  };

  // Modified handleSearch to accept a query parameter
  const handleSearch = (queryToSearch = searchQuery) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const lowerCaseQuery = queryToSearch.toLowerCase();
      const results = mockDrinks.filter(drink =>
        drink.name.toLowerCase().includes(lowerCaseQuery) ||
        drink.category.toLowerCase().includes(lowerCaseQuery) ||
        drink.description.toLowerCase().includes(lowerCaseQuery) // Search by description too
      );
      setFilteredDrinks(results);
      setLoading(false);
      if (queryToSearch.length > 0) {
        saveRecentSearch(queryToSearch);
      }
    }, 500);
  };

  const handleQuickSearch = (keyword) => {
    setSearchQuery(keyword); // Set the search query to the keyword
    // handleSearch(keyword); // useEffect will trigger handleSearch, no need to call it explicitly here
  };

  const renderDrinkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drinkCard}
      // Changed to 'DrinkDetailScreen' as per the corrected CustomerTabNavigator.js
      onPress={() => navigation.navigate('DrinkDetail', { drinkId: item.id })}
    >
      <Image source={getImageSource(item.image)} style={styles.drinkImage} />
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <Text style={styles.drinkPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm đồ uống..."
          value={searchQuery}
          onChangeText={setSearchQuery} // Update searchQuery state directly
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(searchQuery)} // Trigger search on pressing 'search' on keyboard
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Search Buttons */}
      {showRecentSearches && ( // Only show quick search when recent searches are visible
        <View style={styles.quickSearchContainer}>
          <Text style={styles.quickSearchTitle}>Tìm kiếm nhanh</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickSearchButtons}
          >
            {quickSearchKeywords.map((keyword, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickSearchButton}
                onPress={() => handleQuickSearch(keyword)}
              >
                <Text style={styles.quickSearchButtonText}>{keyword}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#8B4513" style={styles.loadingIndicator} />
      ) : (
        <>
          {showRecentSearches && recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <View style={styles.recentSearchesHeader}>
                <Text style={styles.recentSearchesTitle}>Tìm kiếm gần đây</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearAllText}>Xóa tất cả</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.recentSearchItem} onPress={() => setSearchQuery(item)}>
                    <Ionicons name="time-outline" size={20} color="#888" />
                    <Text style={styles.recentSearchText}>{item}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.recentSearchesList}
              />
            </View>
          )}

          {!showRecentSearches && filteredDrinks.length === 0 && searchQuery.length > 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={80} color="#CCCCCC" />
              <Text style={styles.noResultsText}>Không tìm thấy kết quả</Text>
              <Text style={styles.noResultsSubText}>
                Hãy thử tìm kiếm với từ khóa khác nhé!
              </Text>
            </View>
          )}

          {!showRecentSearches && filteredDrinks.length > 0 && (
            <FlatList
              data={filteredDrinks}
              keyExtractor={item => item.id}
              renderItem={renderDrinkItem}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  resultsList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  drinkCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  drinkImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  drinkInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  drinkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  drinkPrice: {
    fontSize: 15,
    color: '#8B4513',
    fontWeight: '600',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 5,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 20,
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
  },
  // New styles for quick search buttons
  quickSearchContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  quickSearchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  quickSearchButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align buttons to the start
    alignItems: 'center',
  },
 quickSearchButton: {
  backgroundColor: '#8B4513', // This is the current background color
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 15,
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#D0D0D0', // This is the current border color
},
quickSearchButtonText: {
  fontSize: 14,
  color: 'white', // This is the current text color
  fontWeight: '500',
},
});

export default SearchScreen;