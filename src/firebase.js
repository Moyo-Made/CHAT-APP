import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyCCAGPIA5o4jy4AqLNIdM6smGQRmYMyNHk",
	authDomain: "chat-7520a.firebaseapp.com",
	projectId: "chat-7520a",
	storageBucket: "chat-7520a.appspot.com",
	messagingSenderId: "1092651178016",
	appId: "1:1092651178016:web:49332ff6fb5a27966e0445",
	measurementId: "G-VL6Y0BGBRX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

export default app;
