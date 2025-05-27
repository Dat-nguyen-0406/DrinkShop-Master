// src/screens/customer/ProfileDetail.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileDetail = () => {
  const { updateUserPassword } = useAuth();
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const data = JSON.parse(userDataString);
          setUserData({
            fullname: data.fullname || "",
            email: data.email || "",
            phone: data.phone || "",
            password: data.password || "",
          });
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUserData = { ...userData };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      setEditMode(false);
      Alert.alert("Thành công", "Thông tin đã được cập nhật");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      // In a real app, you would verify the current password with your backend
      // For this example, we'll just update it locally
      const updatedUserData = { ...userData, password: newPassword };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      // If you have a backend API for password change:
      // await updateUserPassword(currentPassword, newPassword);

      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        
       
        {editMode ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Họ và tên</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData.fullname}
              onChangeText={(text) =>
                setUserData({ ...userData, fullname: text })
              }
              placeholder="Nhập họ và tên"
            />
          ) : (
            <Text style={styles.infoText}>{userData.fullname}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Số điện thoại</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.infoText}>{userData.phone}</Text>
          )}
        </View>
      </View>


<TouchableOpacity
  style={styles.changePasswordButton}
  onPress={() => setShowPasswordModal(true)}
>
  <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
</TouchableOpacity>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu mới</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.modalInput}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
              />
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    color: "#8B4513",
    fontWeight: "bold",
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: "#8B4513",
    fontWeight: "bold",
  },
  profileSection: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  infoItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  infoLabel: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
  },
  input: {
    fontSize: 16,
    color: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#8B4513",
    paddingVertical: 5,
  },
 changePasswordButton: {
  alignSelf: "center",
  marginTop: 30,
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: "#8B4513",
  borderRadius: 5,
},

  changePasswordText: {
  color: "#FFFFFF",
  fontWeight: "bold",
},

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#8B4513",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ProfileDetail;
