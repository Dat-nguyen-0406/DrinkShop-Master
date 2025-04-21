import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTokenAndRole, saveToken, clearToken } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi app khởi động
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const { token, role } = await getTokenAndRole();
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      await clearToken();
      setIsLoggedIn(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, role) => {
    await saveToken(token, role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = async () => {
    await clearToken();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userRole, 
      isLoading, 
      login, 
      logout,
      checkLoginStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);