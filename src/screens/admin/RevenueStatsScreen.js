// src/screens/admin/RevenueStatsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RevenueStatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revenue Statistics</Text>
      <Text>This is a placeholder for revenue statistics.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RevenueStatsScreen;