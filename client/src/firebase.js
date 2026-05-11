import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEweRCtaIHfbVe3ZxZUM-nY2VOqyVT-Pc",
  authDomain: "fleettrack-aa2fa.firebaseapp.com",
  projectId: "fleettrack-aa2fa",
  storageBucket: "fleettrack-aa2fa.firebasestorage.app",
  messagingSenderId: "897248831965",
  appId: "1:897248831965:web:f11ca22c32890cb6366e34",
  measurementId: "G-3SSK75YRBV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // IMPORTANT: Export this!