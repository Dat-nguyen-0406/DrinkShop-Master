
// src/screens/admin/EditDrinkScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const EditDrinkScreen = ({ route, navigation }) => {
  const { drinkId } = route.params || { drinkId: '1' }; // Default for testing
  
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Example categories
  const categories = [
    { id: 'coffee', name: 'Cà phê' },
    { id: 'tea', name: 'Trà' },
    { id: 'milktea', name: 'Trà sữa' },
    { id: 'smoothie', name: 'Sinh tố' },
    { id: 'juice', name: 'Nước ép' },
  ];

  // Simulate fetching drink data
  useEffect(() => {
    const fetchDrinkData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dummy data
        const drinkData = {
          id: drinkId,
          name: 'Cà phê sữa đá',
          price: '29000',
          description: 'Cà phê đậm đà hòa quyện với sữa đặc và đá, tạo nên hương vị thơm ngon khó cưỡng.',
          category: 'coffee',
          imageUrl: 'https://via.placeholder.com/200',
        };
        
        // Set state with fetched data
        setName(drinkData.name);
        setPrice(drinkData.price);
        setDescription(drinkData.description);
        setCategory(drinkData.category);
        setImageUrl(drinkData.imageUrl);
      } catch (error) {
        console.error('Error fetching drink data:', error);
        alert('Không thể tải thông tin đồ uống!');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrinkData();
  }, [drinkId]);

  const handleUpdateDrink = () => {
    // Validate inputs
    if (!name || !price || !description || !category) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    // Here you would typically call an API to update the drink
    console.log('Updating drink:', { id: drinkId, name, price, description, category, imageUrl });
    
    // Navigate back to drinks list
    alert('Đã cập nhật đồ uống thành công!');
    navigation.goBack();
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.drinkImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#ccc" />
            <Text style={styles.placeholderText}>Chưa có hình ảnh</Text>
          </View>
        )}
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Thay đổi hình ảnh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tên đồ uống</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên đồ uống"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả đồ uống"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdateDrink}
        >
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            alert('Chức năng xóa đang được phát triển');
          }}
        >
          <Text style={styles.buttonText}>Xóa đồ uống</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  drinkImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#999',
    marginTop: 8,
  },
  uploadButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: '#8B0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditDrinkScreen;
