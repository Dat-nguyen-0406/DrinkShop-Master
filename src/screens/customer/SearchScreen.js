// src/screens/customer/SearchScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tìm kiếm đồ uống</Text>
      {/* Bạn có thể thêm ô tìm kiếm, danh sách kết quả ở đây */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default SearchScreen;
