// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRbO61eJf69SR9TC2pjtWnCKOH6Pa0Csk",
  authDomain: "blog-9d8e2.firebaseapp.com",
  projectId: "blog-9d8e2",
  storageBucket: "blog-9d8e2.appspot.com",
  messagingSenderId: "384159327081",
  appId: "1:384159327081:web:6322f275c2b7af985693f8",
  measurementId: "G-129G8WQH4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();