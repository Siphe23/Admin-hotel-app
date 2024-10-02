// src/Firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


    const firebaseConfig = {
        apiKey: "AIzaSyB35zqc99O83jS6NZHsYXFpL8wOQ3djxRg",
        authDomain: "hotel-booking-app-a083a.firebaseapp.com",
        projectId: "hotel-booking-app-a083a",
        storageBucket: "hotel-booking-app-a083a.appspot.com",
        messagingSenderId: "386005281931",
        appId: "1:386005281931:web:6e2a5b475b9383f341b88e",
        measurementId: "G-SJE0KBMDPC"
     
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
