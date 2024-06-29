// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC19aC9ctJyiMH3HshT15dNC_bAxfBhW70",
  authDomain: "akshiotp.firebaseapp.com",
  projectId: "akshiotp",
  storageBucket: "akshiotp.appspot.com",
  messagingSenderId: "126313505692",
  appId: "1:126313505692:web:f3e3c6cdf5f78b68f6de59",
  measurementId: "G-09LCLEPQV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
