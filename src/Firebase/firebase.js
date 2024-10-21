import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB35zqc99O83jS6NZHsYXFpL8wOQ3djxRg",
    authDomain: "hotel-booking-app-a083a.firebaseapp.com",
    projectId: "hotel-booking-app-a083a",
    storageBucket: "hotel-booking-app-a083a.appspot.com",
    messagingSenderId: "386005281931",
    appId: "1:386005281931:web:6e2a5b475b9383f341b88e",
    measurementId: "G-SJE0KBMDPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// Export the initialized services
export { app, analytics, auth, db, storage };
