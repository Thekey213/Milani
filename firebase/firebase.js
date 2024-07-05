import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAzqOMYd3QXsX26iyojXfICz_U4e2UKRSM",
    authDomain: "birdappproject.firebaseapp.com",
    databaseURL: "https://birdappproject-default-rtdb.firebaseio.com",
    projectId: "birdappproject",
    storageBucket: "birdappproject.appspot.com",
    messagingSenderId: "764585228279",
    appId: "1:764585228279:web:e44dfa5e2451c45f58e0f2",
    measurementId: "G-P986W0JEN9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { db, storage };