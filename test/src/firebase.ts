// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUWIJ0Wum-Om5l-mMG_UGZHKrTZtdMMw4",
  authDomain: "ionictest-ad918.firebaseapp.com",
  projectId: "ionictest-ad918",
  storageBucket: "ionictest-ad918.firebasestorage.app",
  messagingSenderId: "831327404238",
  appId: "1:831327404238:web:2926a002f11efe5282509f",
  measurementId: "G-GMGQ1740MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);