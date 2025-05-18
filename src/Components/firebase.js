// First, fix the firebase.js file
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVRSIvOt3QXRV6f9xzzOs5C1-_JgIi81o",
  authDomain: "trivio-fb8f5.firebaseapp.com",
  projectId: "trivio-fb8f5",
  storageBucket: "trivio-fb8f5.firebasestorage.app",
  messagingSenderId: "619026190515",
  appId: "1:619026190515:web:4b51f146c9714e19efe0c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Make sure to pass the app to getAuth
export const db = getFirestore(app);
export default app;