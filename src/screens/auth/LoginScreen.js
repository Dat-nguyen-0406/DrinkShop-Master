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
        if (userData.email === email && userData.password === password) {
          foundUser = { id: doc.id, ...userData };
        }
      });

      if (foundUser) {
        console.log("Đăng nhập thành công, chuyển hướng...");
          await AsyncStorage.setItem("userData", JSON.stringify({
         id: foundUser.id,
         fullname: foundUser.fullname,
         email: foundUser.email,
         phone: foundUser.phone,
         role: foundUser.role,
  }));
        await login(foundUser.id, foundUser.role);

        await new Promise((resolve) => setTimeout(resolve, 500));

        Alert.alert("Thành công", `Chào ${foundUser.fullname}`);
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
            source={require('../../assets/images/icon.png')} 
            style={styles.logo}
            defaultSource={require('../../assets/images/icon.png')}
          />
          <Text style={styles.appTitle}>Coffee Shop</Text>
        </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
          />
        </TouchableOpacity>
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

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  icon: {
    marginRight: 10,
    color: "#666",
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    color: "#8B4513",
    marginTop: 10,
  },
});
