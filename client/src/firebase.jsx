// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-a7387.firebaseapp.com",
  projectId: "mernestate-a7387",
  storageBucket: "mernestate-a7387.appspot.com",
  messagingSenderId: "100517120567",
  appId: "1:100517120567:web:066ba8988eebae4a52cdb2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);