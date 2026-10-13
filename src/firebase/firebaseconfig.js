// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQqCH4_YzRjvQ3ldIQBS7x1bHtMPMWW2I",
  authDomain: "boatnile-9430f.firebaseapp.com",
  databaseURL: "https://boatnile-9430f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "boatnile-9430f",
  storageBucket: "boatnile-9430f.firebasestorage.app",
  messagingSenderId: "417650711554",
  appId: "1:417650711554:web:06f016f92ad095f1079b1b",
  measurementId: "G-3CG0L2L769"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);