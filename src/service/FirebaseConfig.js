// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsfjVUR_8hiphuzOo6QE3XPrp3T581T04",
  authDomain: "aitripplanner-82cf2.firebaseapp.com",
  projectId: "aitripplanner-82cf2",
  storageBucket: "aitripplanner-82cf2.firebasestorage.app",
  messagingSenderId: "899300132052",
  appId: "1:899300132052:web:3eeb0e0d75756c2c872741",
  measurementId: "G-9HXYECTY18"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
