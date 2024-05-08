// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "wanderbud-2c6e5.firebaseapp.com",
    projectId: "wanderbud-2c6e5",
    storageBucket: "wanderbud-2c6e5.appspot.com",
    messagingSenderId: "1242278745",
    appId: "1:1242278745:web:22087ca9df59a507a17a48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;