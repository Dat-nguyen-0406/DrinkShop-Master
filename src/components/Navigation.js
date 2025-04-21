// src/components/Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Customer Screens
import CustomerTabNavigator from './CustomerTabNavigator';
// Admin Stack
import AdminTabNavigator from './AdminTabNavigator';

const Stack = createStackNavigator();

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#8B4513" />
    <Text style={{ marginTop: 10 }}>Đang tải...</Text>
  </View>
);

const Navigation = () => {
  const { isLoggedIn, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : userRole === 'admin' ? (
          // Admin screens
          <Stack.Screen name="AdminHome" component={AdminTabNavigator} />
        ) : (
          // Customer screens
          <Stack.Screen name="CustomerHome" component={CustomerTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;