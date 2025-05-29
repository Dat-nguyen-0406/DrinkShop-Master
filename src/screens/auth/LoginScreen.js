import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal, // Import Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../sever/firebase";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getFirestore(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // THÊM HAI DÒNG NÀY VÀO ĐÂY:
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // State cho modal chào mừng
  const [welcomeUserName, setWelcomeUserName] = useState(""); // State lưu tên người dùng
  // HẾT PHẦN THÊM

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    console.log("Bắt đầu đăng nhập...");

    setIsLoading(true);
    try {
      console.log("Kết nối Firestore...");
      const querySnapshot = await getDocs(collection(db, "users"));

      console.log(`Tìm thấy ${querySnapshot.size} người dùng`);
      let foundUser = null;

      querySnapshot.forEach((doc) => {
        console.log(`Kiểm tra user: ${doc.id}`);
        const userData = doc.data();
        // Cần đảm bảo rằng email và password khớp nhau.
        // Bạn có thể cân nhắc trim() các giá trị này nếu có khả năng có khoảng trắng.
        if (userData.email === email && userData.password === password) {
          foundUser = { id: doc.id, ...userData };
        }
      });

      if (foundUser) {
        console.log("Đăng nhập thành công, chuẩn bị chuyển hướng...");
        await AsyncStorage.setItem("userData", JSON.stringify({
          id: foundUser.id,
          fullname: foundUser.fullname,
          email: foundUser.email,
          phone: foundUser.phone,
          role: foundUser.role,
          password: foundUser.password, // Nhắc lại: không nên lưu mật khẩu plaintext
        }));

        // Sử dụng setWelcomeUserName và setShowWelcomeModal ở đây
        setWelcomeUserName(foundUser.fullname); // Lưu tên người dùng để hiển thị
        setShowWelcomeModal(true); // Hiển thị modal chào mừng

        // Đợi một chút để người dùng nhìn thấy modal, sau đó tự động đăng nhập và điều hướng
        setTimeout(async () => {
          await login(foundUser.id, foundUser.role);
          setShowWelcomeModal(false); // Đóng modal sau khi điều hướng
        }, 1500); // Hiển thị modal trong 1.5 giây
        
      } else {
        console.log("Sai thông tin đăng nhập");
        Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Alert.alert("Lỗi", `Chi tiết lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            defaultSource={require("../../assets/images/icon.png")}
          />
          <Text style={styles.appTitle}>Coffee Shop</Text>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999" // Thêm màu cho placeholder
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999" // Thêm màu cho placeholder
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666" // Màu cho icon mắt
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerButton}>
          <Text style={styles.registerText}>Chưa có tài khoản? <Text style={styles.registerLink}>Đăng ký ngay</Text></Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Welcome Modal */}
      <Modal
        animationType="fade" // Hiệu ứng mờ dần
        transparent={true} // Cho phép nền trong suốt
        visible={showWelcomeModal} // Điều khiển hiển thị
        onRequestClose={() => {
          // Xử lý khi người dùng nhấn nút back (Android)
          setShowWelcomeModal(false);
        }}
      >
        <View style={welcomeModalStyles.centeredView}>
          <View style={welcomeModalStyles.modalView}>
            <Image
              source={require("../../assets/images/icon.png")} // Thay bằng icon chào mừng của bạn
              style={welcomeModalStyles.modalIcon}
            />
            <Text style={welcomeModalStyles.modalTitle}>Chào mừng!</Text>
            <Text style={welcomeModalStyles.modalText}>
              Chào mừng bạn trở lại, {welcomeUserName}!
            </Text>
            <TouchableOpacity
              style={welcomeModalStyles.closeButton}
              onPress={() => setShowWelcomeModal(false)} // Cho phép đóng thủ công
            >
              <Text style={welcomeModalStyles.closeButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Nền sáng hơn
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25, // Giảm padding ngang một chút
    justifyContent: "center",
    paddingBottom: 40, // Tăng padding dưới
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80, // Tăng khoảng cách từ trên xuống
    marginBottom: 50, // Tăng khoảng cách dưới logo
  },
  logo: {
    width: 150, // Tăng kích thước logo
    height: 150, // Tăng kích thước logo
    resizeMode: "contain",
  },
  appTitle: {
    fontSize: 32, // Font lớn hơn cho tiêu đề
    fontWeight: "bold",
    color: "#8B4513", // Màu nâu đậm
    marginTop: 15,
  },
  inputGroup: {
    marginBottom: 30, // Khoảng cách lớn hơn giữa nhóm input và nút
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Nền trắng cho input
    borderRadius: 10, // Bo tròn góc input
    paddingHorizontal: 15, // Padding bên trong input
    marginBottom: 15, // Khoảng cách giữa các input
    shadowColor: "#000", // Thêm đổ bóng
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 12, // Tăng khoảng cách giữa icon và input
    color: "#666",
  },
  input: {
    flex: 1,
    height: 50, // Chiều cao input lớn hơn
    fontSize: 16,
    color: "#333", // Màu chữ đậm hơn
  },
  passwordToggle: {
    padding: 10,
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 18, // Padding dọc lớn hơn
    borderRadius: 30, // Bo tròn nhiều hơn cho nút
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#8B4513", // Đổ bóng cho nút
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
    shadowColor: "transparent", // Loại bỏ shadow khi disabled
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18, // Font lớn hơn cho text nút
  },
  registerButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  registerText: {
    textAlign: "center",
    color: "#666", // Màu chữ nhẹ nhàng hơn
    fontSize: 15,
  },
  registerLink: {
    color: "#8B4513", // Màu nâu đậm cho link
    fontWeight: "bold",
  },
});

// Styles for the Welcome Modal - giữ nguyên vì đã khá tốt
const welcomeModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // Nền mờ
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
    resizeMode: "contain",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#8B4513",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});