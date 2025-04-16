import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const ROLE_KEY = 'userRole';

export const saveToken = async (token, role) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ROLE_KEY, role);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(ROLE_KEY, role);
    }
  } catch (error) {
    console.error('Error saving token and role', error);
  }
};

export const getTokenAndRole = async () => {
  try {
    if (Platform.OS === 'web') {
      return {
        token: localStorage.getItem(TOKEN_KEY),
        role: localStorage.getItem(ROLE_KEY),
      };
    } else {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const role = await AsyncStorage.getItem(ROLE_KEY);
      return { token, role };
    }
  } catch (error) {
    console.error('Error retrieving token and role', error);
    return { token: null, role: null };
  }
};

export const clearAllStorage = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing storage', error);
  }
};
