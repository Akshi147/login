// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyJgEs5XR0Xe7iJgINKdlKZOlaX43Jt5o",
  authDomain: "akshita01.firebaseapp.com",
  projectId: "akshita01",
  storageBucket: "akshita01.appspot.com",
  messagingSenderId: "278614166071",
  appId: "1:278614166071:web:0ad5fdc757988cf6ac8db2",
  measurementId: "G-2MBYCLF9R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
