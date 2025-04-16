// src/components/Navigation.js

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getTokenAndRole, clearToken } from '../utils/storage';
import { Platform, Text, View, ActivityIndicator } from 'react-native';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { token, role } = await getTokenAndRole();
        console.log('Token:', token, 'Role:', role, 'Platform:', Platform.OS);
        if (token) {
          setIsLoggedIn(true);
          setUserRole(role);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
        // In case of an error, clear any potentially corrupted tokens
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);

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