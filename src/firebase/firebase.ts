// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpvmezsgKOfKoGvBTX_YRoCnNt9yNIX9M",
  authDomain: "lungilok-e180f.firebaseapp.com",
  projectId: "lungilok-e180f",
  storageBucket: "lungilok-e180f.firebasestorage.app",
  messagingSenderId: "325561995805",
  appId: "1:325561995805:web:0f69c64dfbe8f346516cf4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;