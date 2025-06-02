import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Thêm import này

const firebaseConfig = {
  apiKey: "AIzaSyA-sDgp1shnek8cCFih8IqrgvDZS7o9A9s",
  authDomain: "database-shop-ea84c.firebaseapp.com",
  databaseURL:
    "https://database-shop-ea84c-default-rtdb.asia-southeast1.firebasedatabase.app", // Thêm dòng này
  projectId: "database-shop-ea84c",
  storageBucket: "database-shop-ea84c.firebasestorage.app",
  messagingSenderId: "160513197",
  appId: "1:160513197:web:d24bed880b6c428b359a24",
  measurementId: "G-3682TY94VW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Khởi tạo Realtime Database

export { app, database }; // Xuất cả app và database
