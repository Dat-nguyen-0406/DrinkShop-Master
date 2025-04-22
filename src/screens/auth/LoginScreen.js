import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from "../../sever/firebase";


 // Đường dẫn này phải đúng vớ

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      // **Firebase Authentication**
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // **Lấy vai trò người dùng (ví dụ, từ Firestore)**
      const userRole = await getUserRole(email);

      // **Gọi hàm login từ AuthContext**
      await login(user.refreshToken, userRole);

      console.log('Đăng nhập thành công với vai trò:', userRole);

    } catch (error) {
      console.error("Lỗi đăng nhập:", error.code, error.message);
      let errorMessage = 'Đã xảy ra lỗi trong quá trình đăng nhập.';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Tài khoản người dùng đã bị vô hiệu hóa.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy người dùng với email này.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Đăng nhập thất bại do quá nhiều lần thử. Vui lòng thử lại sau.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối Internet của bạn.';
          break;
        default:
          errorMessage = 'Email hoặc mật khẩu không chính xác.';
          break;
      }
      Alert.alert('Đăng nhập thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // **Hàm giả định để lấy vai trò người dùng (cần triển khai thật)**
  const getUserRole = async (email) => {
    // **Logic này cần được thay thế bằng code lấy vai trò từ CSDL của bạn**
    // **Ví dụ: sử dụng Firestore, Realtime Database, v.v.**
    // **Code mẫu này chỉ là ví dụ và KHÔNG an toàn để dùng trong production**
    if (email === 'admin@gmail.com') {
      return 'admin';
    } else {
      return 'customer';
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text style={styles.appTitle}>Drink Shop</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng nhập</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>HOẶC</Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../../assets/images/face.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, paddingBottom: 30 },
  logoContainer: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#8B4513', marginTop: 10 },
  formContainer: { paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginBottom: 20,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },
  passwordToggle: { padding: 10 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotPasswordText: { color: '#8B4513', fontSize: 14 },
  button: {
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: '#A9A9A9' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  orText: { textAlign: 'center', color: '#999', marginVertical: 20 },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIcon: { width: 30, height: 30, resizeMode: 'contain' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: '#666', fontSize: 14 },
  registerLink: { color: '#8B4513', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
