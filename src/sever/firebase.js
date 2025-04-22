// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-sDgp1shnek8cCFih8IqrgvDZS7o9A9s",
  authDomain: "database-shop-ea84c.firebaseapp.com",
  projectId: "database-shop-ea84c",
  storageBucket: "database-shop-ea84c.firebasestorage.app",
  messagingSenderId: "160513197",
  appId: "1:160513197:web:d24bed880b6c428b359a24",
  measurementId: "G-3682TY94VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;