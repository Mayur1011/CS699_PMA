// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "projectmanagement-a50c0.firebaseapp.com",
  projectId: "projectmanagement-a50c0",
  storageBucket: "projectmanagement-a50c0.firebasestorage.app",
  messagingSenderId: "495281155332",
  appId: "1:495281155332:web:9f169efd3edbd4707d3451",
  measurementId: "G-8S9XN1CBHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);