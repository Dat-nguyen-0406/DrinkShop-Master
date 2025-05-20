import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CheckoutScreen = ({ route, navigation }) => {
  const { cartItems, totalPrice } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert(
        "Đặt hàng thành công",
        `Đơn hàng của bạn đã được đặt thành công với phương thức thanh toán ${paymentMethod === 'cash' ? 'tiền mặt' : 'QR code'}.`,
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('HomeTab')
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="receipt" size={22} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          </View>
          
          <View style={styles.orderSummary}>
            {cartItems.map((item, index) => (
              <View key={item.id} style={[
                styles.orderItem,
                index !== cartItems.length - 1 && styles.orderItemBorder
              ]}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* Payment Options Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="payment" size={22} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>

          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentMethod === 'cash' && styles.selectedPayment
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={styles.paymentContent}>
                <MaterialIcons 
                  name="attach-money" 
                  size={24} 
                  color={paymentMethod === 'cash' ? "#4ECDC4" : "#666"} 
                />
                <View style={styles.paymentTextContainer}>
                  <Text style={[
                    styles.paymentButtonText,
                    paymentMethod === 'cash' && styles.selectedPaymentText
                  ]}>
                    Thanh toán khi nhận hàng
                  </Text>
                  <Text style={styles.paymentDescription}>
                    Trả tiền mặt khi nhận được đơn hàng
                  </Text>
                </View>
              </View>
              {paymentMethod === 'cash' && (
                <MaterialIcons name="check-circle" size={24} color="#4ECDC4" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentButton,
                paymentMethod === 'qr' && styles.selectedPayment
              ]}
              onPress={() => setPaymentMethod('qr')}
            >
              <View style={styles.paymentContent}>
                <MaterialIcons 
                  name="qr-code" 
                  size={24} 
                  color={paymentMethod === 'qr' ? "#4ECDC4" : "#666"} 
                />
                <View style={styles.paymentTextContainer}>
                  <Text style={[
                    styles.paymentButtonText,
                    paymentMethod === 'qr' && styles.selectedPaymentText
                  ]}>
                    QR Code
                  </Text>
                  <Text style={styles.paymentDescription}>
                    Quét mã QR để thanh toán
                  </Text>
                </View>
              </View>
              {paymentMethod === 'qr' && (
                <MaterialIcons name="check-circle" size={24} color="#4ECDC4" />
              )}
            </TouchableOpacity>

            {paymentMethod === 'qr' && (
              <View style={styles.qrCodeContainer}>
                <Image
                  source={require('../../assets/images/qr.png')}
                  style={styles.qrCodeImage}
                  resizeMode="contain"
                />
                <Text style={styles.qrCodeInstruction}>
                  Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Delivery Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-shipping" size={22} color="#F9C74F" />
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <MaterialIcons name="person" size={20} color="#666" />
              <Text style={styles.deliveryText}>Nguyễn Văn Nam</Text>
            </View>
            
            <View style={styles.deliveryRow}>
              <MaterialIcons name="phone" size={20} color="#666" />
              <Text style={styles.deliveryText}>0919193045</Text>
            </View>
            
            <View style={styles.deliveryRow}>
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.deliveryText}>
                123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.changeAddressButton}>
            <Text style={styles.changeAddressText}>Thay đổi địa chỉ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>Tổng tiền:</Text>
          <Text style={styles.footerPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.placeOrderButton} 
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.placeOrderButtonText}>Đang xử lý...</Text>
          ) : (
            <Text style={styles.placeOrderButtonText}>Đặt hàng ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  orderSummary: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 15,
    color: '#666',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  paymentOptions: {
    marginBottom: 8,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 12,
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  selectedPayment: {
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
  },
  paymentButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  selectedPaymentText: {
    color: '#4ECDC4',
  },
  paymentDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  qrCodeContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginVertical: 8,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  qrCodeInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  deliveryInfo: {
    marginBottom: 16,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  changeAddressButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  changeAddressText: {
    fontSize: 15,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 15,
    color: '#666',
  },
  footerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  placeOrderButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;