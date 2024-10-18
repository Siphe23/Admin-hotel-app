// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage
// You can import analytics if you decide to use it later
// import { getAnalytics } from "firebase/analytics"; 

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

// Initialize Firebase services
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// You can initialize analytics if you need it
// const analytics = getAnalytics(app);

// Export the necessary Firebase services
export { auth, db, storage };
