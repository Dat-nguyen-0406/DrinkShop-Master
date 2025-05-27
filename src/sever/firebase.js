// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-sDgp1shnek8cCFih8IqrgvDZS7o9A9s",
  authDomain: "database-shop-ea84c.firebaseapp.com",
  projectId: "database-shop-ea84c",
  storageBucket: "database-shop-ea84c.appspot.com",
  messagingSenderId: "160513197",
  appId: "1:160513197:web:d24bed880b6c428b359a24",
  measurementId: "G-3682TY94VW",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 💡 Khởi tạo auth nếu chưa tồn tại
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app); // Nếu đã init rồi thì lấy lại
  } else {
    throw error;
  }
}

const db = getFirestore(app);
export { app, auth, db };

