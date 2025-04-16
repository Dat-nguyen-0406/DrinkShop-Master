import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';

const AddCategoryScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, make an API call to add the category
      // Simulating API call
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert('Thành công', 'Đã thêm danh mục mới', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Lỗi', 'Không thể thêm danh mục');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên danh mục</Text>
      <TextInput
        style={styles.input}
        value={categoryName}
        onChangeText={setCategoryName}
        placeholder="Nhập tên danh mục mới"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAddCategory}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Thêm danh mục</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddCategoryScreen;