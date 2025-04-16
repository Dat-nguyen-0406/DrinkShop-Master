// src/screens/admin/DrinkDetailsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DrinkDetailsScreen = ({ route, navigation }) => {
  const { drinkId } = route.params || { drinkId: '1' }; // Default for testing
  const [isLoading, setIsLoading] = useState(true);
  const [drink, setDrink] = useState(null);

  // Simulate fetching drink data
  useEffect(() => {
    const fetchDrinkDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dummy data
        const drinkData = {
          id: drinkId,
          name: 'Cà phê sữa đá',
          price: '29,000 đ',
          description: 'Cà phê đậm đà hòa quyện với sữa đặc và đá, tạo nên hương vị thơm ngon khó cưỡng.',
          category: 'Cà phê',
          imageUrl: 'https://via.placeholder.com/400',
          ingredients: ['Cà phê nguyên chất', 'Sữa đặc', 'Đá'],
          nutritionFacts: {
            calories: '120 kcal',
            sugar: '12g',
            caffeine: '65mg'
          },
          ratings: 4.5,
          reviewCount: 128,
          isAvailable: true,
          createdAt: '01/01/2023',
          updatedAt: '15/03/2023'
        };
        
        setDrink(drinkData);
      } catch (error) {
        console.error('Error fetching drink details:', error);
        alert('Không thể tải thông tin đồ uống!');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrinkDetails();
  }, [drinkId]);

  const handleEditDrink = () => {
    navigation.navigate('EditDrink', { drinkId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#D32F2F" />
        <Text style={styles.errorText}>Không tìm thấy thông tin đồ uống!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: drink.imageUrl }} style={styles.drinkImage} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.drinkName}>{drink.name}</Text>
          <Text style={styles.price}>{drink.price}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditDrink}>
          <Ionicons name="pencil" size={22} color="#fff" />
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mô tả</Text>
        <Text style={styles.description}>{drink.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin chung</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Danh mục:</Text>
          <Text style={styles.infoValue}>{drink.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trạng thái:</Text>
          <Text style={[styles.infoValue, drink.isAvailable ? styles.available : styles.unavailable]}>
            {drink.isAvailable ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Đánh giá:</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>{drink.ratings}</Text>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.reviewCount}>({drink.reviewCount} đánh giá)</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thành phần</Text>
        {drink.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Ionicons name="checkmark-circle" size={18} color="#8B0000" />
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giá trị dinh dưỡng</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Calories:</Text>
          <Text style={styles.infoValue}>{drink.nutritionFacts.calories}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Đường:</Text>
          <Text style={styles.infoValue}>{drink.nutritionFacts.sugar}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Caffeine:</Text>
          <Text style={styles.infoValue}>{drink.nutritionFacts.caffeine}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin thêm</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày tạo:</Text>
          <Text style={styles.infoValue}>{drink.createdAt}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
          <Text style={styles.infoValue}>{drink.updatedAt}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  drinkImage: {
    width: '100%',
    height: 250,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drinkName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 18,
    color: '#8B0000',
    fontWeight: '600',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  available: {
    color: '#4CAF50',
  },
  unavailable: {
    color: '#F44336',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ingredientText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
});

export default DrinkDetailsScreen;