// src/screens/admin/AddDrinkScreen.js
import 'react-native-get-random-values';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';

// Import Firebase functions
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../sever/firebase'; // Đảm bảo đường dẫn này đúng

const db = getFirestore(app);
const storage = getStorage(app);

const AddDrinkScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // State để lưu ID danh mục đã chọn
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  // State để lưu tên danh mục đã chọn
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục từ Firestore
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "danhmuc"));
      const fetchedCategories = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Lưu cả ID và tên danh mục vào mảng categories
        fetchedCategories.push({ id: doc.id, name: data.categoryName });
      });
      setCategories(fetchedCategories);
      // Đặt giá trị mặc định cho danh mục đầu tiên nếu có
      if (fetchedCategories.length > 0) {
        setSelectedCategoryId(fetchedCategories[0].id);
        setSelectedCategoryName(fetchedCategories[0].name);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      Alert.alert("Lỗi", "Không thể tải danh mục. Vui lòng thử lại.");
    }
  };

  const pickImage = async () => {
    console.log("pickImage: Hàm đã được gọi.");
    let result;
    try {
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log("pickImage: Kết quả ImagePicker:", result);
    } catch (error) {
        console.error("pickImage: Lỗi khi gọi ImagePicker:", error);
        Alert.alert("Lỗi", "Không thể mở thư viện ảnh.");
        return;
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        console.log("pickImage: Đã chọn ảnh, URI:", result.assets[0].uri);
    } else if (result.canceled) {
        console.log("pickImage: Người dùng đã hủy chọn ảnh.");
    } else {
        console.log("pickImage: Không có tài sản (assets) nào được trả về.");
    }
  };

  const uploadImageToFirebase = async (uri) => {
    setImageUploadLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("uploadImageToFirebase: Blob đã tạo:", blob);
      const filename = `drinks/${uuidv4()}.jpg`;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytes(storageRef, blob);

      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded to:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên Firebase Storage:", error);
      Alert.alert("Lỗi tải ảnh", "Không thể tải ảnh lên. Vui lòng thử lại.");
      return null;
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleAddDrink = async () => {
    // Validate inputs
    if (!name.trim() || !price.trim() || !description.trim() || !selectedCategoryId) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Convert price to number
    const numericPrice = parseFloat(price.trim());
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert("Lỗi", "Giá không hợp lệ. Vui lòng nhập số dương.");
      return;
    }

    setIsSubmitting(true);
    let finalImage = null;

    try {
      if (image) {
        finalImage = await uploadImageToFirebase(image);
        if (!finalImage) {
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Adding new drink to Firestore:", {
        drinkname: name.trim(), // Trường tên đồ uống trên Firestore
        price: numericPrice,
        description: description.trim(),
        categoryId: selectedCategoryId,   // <-- Lưu ID danh mục
        category: selectedCategoryName, // <-- LƯU TÊN DANH MỤC
        image: finalImage,
        active: true, // Mặc định active khi thêm mới
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add document to 'douong' collection
      await addDoc(collection(db, "douong"), {
        drinkname: name.trim(), // Trường tên đồ uống trên Firestore
        price: numericPrice,
        description: description.trim(),
        categoryId: selectedCategoryId,   // <-- Lưu ID danh mục
        category: selectedCategoryName, // <-- LƯU TÊN DANH MỤC
        image: finalImage,
        active: true, // Mặc định active khi thêm mới
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Thành công", "Đã thêm đồ uống mới vào Firebase!");
      // Reset form fields
      setName("");
      setPrice("");
      setDescription("");
      // Reset category về danh mục đầu tiên nếu có
      if (categories.length > 0) {
        setSelectedCategoryId(categories[0].id);
        setSelectedCategoryName(categories[0].name);
      } else {
        setSelectedCategoryId("");
        setSelectedCategoryName("");
      }
      setImage(null);
      navigation.goBack(); // Quay lại màn hình danh sách đồ uống
    } catch (error) {
      console.error("Lỗi khi thêm đồ uống vào Firestore:", error);
      Alert.alert("Lỗi", `Không thể thêm đồ uống: ${error.message}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.drinkImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={50} color="#ccc" />
            <Text style={styles.placeholderText}>Chưa có ảnh</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={imageUploadLoading}
        >
          {imageUploadLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Chọn ảnh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tên đồ uống</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên đồ uống"
          value={name}
          onChangeText={setName}
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Giá</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập mô tả"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Danh mục</Text>
        {categories.length > 0 ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategoryId} // Chọn dựa trên ID
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCategoryId(itemValue);
                // Tìm tên danh mục tương ứng với ID đã chọn
                const selectedCat = categories.find(cat => cat.id === itemValue);
                if (selectedCat) {
                  setSelectedCategoryName(selectedCat.name);
                }
              }}
              enabled={!isSubmitting}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>
        ) : (
          <Text style={styles.noCategoriesText}>Đang tải danh mục hoặc không có danh mục nào.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAddDrink}
        disabled={isSubmitting || imageUploadLoading}
      >
        {isSubmitting || imageUploadLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Thêm đồ uống</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  drinkImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#999",
    marginTop: 8,
  },
  uploadButton: {
    backgroundColor: "#8B0000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
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
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  noCategoriesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddDrinkScreen;