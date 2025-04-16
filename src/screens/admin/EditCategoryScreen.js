import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';

const EditCategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [categoryName, setCategoryName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load category data
    if (category) {
      setCategoryName(category.name);
      setIsActive(category.active);
      setIsLoading(false);
    }
  }, [category]);

  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, make an API call to update the category
      // Simulating API call
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert('Thành công', 'Đã cập nhật danh mục', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Lỗi', 'Không thể cập nhật danh mục');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên danh mục</Text>
      <TextInput
        style={styles.input}
        value={categoryName}
        onChangeText={setCategoryName}
        placeholder="Nhập tên danh mục"
        autoCapitalize="none"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái hoạt động</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#8B0000" }}
          thumbColor={isActive ? "#ffffff" : "#f4f3f4"}
          onValueChange={setIsActive}
          value={isActive}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleUpdateCategory}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Cập nhật</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditCategoryScreen;