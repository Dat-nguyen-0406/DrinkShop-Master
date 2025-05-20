import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/customer/HomeScreen';
import DrinkListScreen from '../screens/customer/DrinkListScreen';
import DrinkDetailScreen from '../screens/customer/DrinkDetailScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import CartScreen from '../screens/customer/CartScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const CartStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
    <HomeStack.Screen name="DrinkList" component={DrinkListScreen} options={{ title: 'Danh sách đồ uống' }} />
    <HomeStack.Screen name="DrinkDetail" component={DrinkDetailScreen} options={{ title: 'Chi tiết đồ uống' }} />
  </HomeStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="Search" component={SearchScreen} options={{ title: 'Tìm kiếm' }} />
    <SearchStack.Screen name="DrinkDetail" component={DrinkDetailScreen} options={{ title: 'Chi tiết đồ uống' }} />
  </SearchStack.Navigator>
);

const CartStackScreen = () => (
  <CartStack.Navigator>
    <CartStack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
    <CartStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} /> 
  </CartStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} />
  </ProfileStack.Navigator>
);

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Trang chủ', headerShown: false }} />
      <Tab.Screen name="SearchTab" component={SearchStackScreen} options={{ title: 'Tìm kiếm', headerShown: false }} />
      <Tab.Screen name="CartTab" component={CartStackScreen} options={{ title: 'Giỏ hàng', headerShown: false }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: 'Tài khoản', headerShown: false }} />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;