import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKqllKSCqiZ0v_7cY00YVLOPXRNmNshSQ",
  authDomain: "assignment-tracker-578dc.firebaseapp.com",
  projectId: "assignment-tracker-578dc",
  storageBucket: "assignment-tracker-578dc.firebasestorage.app",
  messagingSenderId: "270559208616",
  appId: "1:270559208616:web:b54d87f601cdd1c37c0e9d",
  measurementId: "G-SVLQ30L34E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db   = getFirestore(app);
export const auth = getAuth(app);
