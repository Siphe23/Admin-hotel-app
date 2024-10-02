import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/footer.css';
import { auth, storage, db } from '../Firebase/firebase'; // Ensure the correct Firebase imports
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';

import { login } from '../redux/authSlice'; // Correct import


function AdminSignup() {
  const dispatch = useDispatch(); // For dispatching login actions
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store the uploaded image file
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phone: '',
    userType: 'admin', // Default to 'admin'
    password: ''
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview the image
      };
      setImageFile(file); // Save the file for Firebase upload
      reader.readAsDataURL(file);
    }
  };

  const handleSignupChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  // Function to handle signup with Firebase
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
      const user = userCredential.user;

      // Upload profile picture if provided
      let profileImageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // Save user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: userDetails.username,
        email: userDetails.email,
        phone: userDetails.phone,
        userType: userDetails.userType,
        profilePicture: profileImageUrl,
      });

      alert('User signed up successfully!');
      // Dispatch login action with user role
      dispatch(login({ role: userDetails.userType }));

      // Reset form fields
      setUserDetails({
        username: '',
        email: '',
        phone: '',
        userType: 'admin',
        password: ''
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Error during signup');
    }
  };

  return (
    <>
      <Navbar />
      <h2>Sign up to create an account</h2>
      <form className="signup-form" onSubmit={handleSignupSubmit}>
        <input 
          type="text" 
          id="username" 
          value={userDetails.username} 
          onChange={handleSignupChange} 
          placeholder="Enter your full name" 
          required 
        />
        <input 
          type="email" 
          id="email" 
          value={userDetails.email} 
          onChange={handleSignupChange} 
          placeholder="Enter your email" 
          required 
        />
        <input 
          type="tel" 
          id="phone" 
          value={userDetails.phone} 
          onChange={handleSignupChange} 
          placeholder="Enter your phone number" 
          required 
        />
        <select 
          id="userType" 
          value={userDetails.userType} 
          onChange={handleSignupChange}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        {imagePreview && <img src={imagePreview} alt="Profile Preview" />}
        <input 
          type="password" 
          id="password" 
          value={userDetails.password} 
          onChange={handleSignupChange} 
          placeholder="Enter your password" 
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
      <Footer />
    </>
  );
}

export default AdminSignup;
