// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ2Cv1wFyJ10sOhMaRBsqGlspPogG8caU",
  authDomain: "ashu-test-16995.firebaseapp.com",
  projectId: "ashu-test-16995",
  storageBucket: "ashu-test-16995.appspot.com",
  messagingSenderId: "861044022495",
  appId: "1:861044022495:web:573f904b27f7b2e9a2dd6a",
  measurementId: "G-FB9XLFVNDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
