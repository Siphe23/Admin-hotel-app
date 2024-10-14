import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/footer.css';
import { auth, storage, db } from '../Firebase/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'; 
import '../assets/auth.css'; 


function AdminSignup() {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phone: '',
    userType: 'admin',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      setImageFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleSignupChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    setSuccessMessage(''); 

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
      const user = userCredential.user;

      let profileImageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        username: userDetails.username,
        email: userDetails.email,
        phone: userDetails.phone,
        userType: userDetails.userType,
        profilePicture: profileImageUrl,
      });

      setSuccessMessage('User signed up successfully!');
      dispatch(login({ role: userDetails.userType }));

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
      setErrorMessage(error.message); 
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
      <Footer />
    </>
  );
}

export default AdminSignup;
