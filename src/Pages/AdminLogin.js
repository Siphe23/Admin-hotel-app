import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction } from '../redux/authSlice'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/footer.css';
import { auth } from '../Firebase/firebase'; // Ensure the correct Firebase imports
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // For dispatching login actions
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    userType: 'admin', // Default user type
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/adminhome');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const userCredential = await signInWithEmailAndPassword(auth, loginDetails.email, loginDetails.password);
      const user = userCredential.user;

      dispatch(loginAction({ role: loginDetails.userType, uid: user.uid }));

     
      if (loginDetails.userType === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/adminhome');
      }
    } catch (error) {
      console.error('Error during login: ', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Admin Login</h2>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            id="email" 
            value={loginDetails.email} 
            onChange={handleLoginChange} 
            placeholder="Enter your email" 
            required 
          />
          <input 
            type="password" 
            id="password" 
            value={loginDetails.password} 
            onChange={handleLoginChange} 
            placeholder="Enter your password" 
            required 
          />
          <select 
            id="userType" 
            value={loginDetails.userType} 
            onChange={handleLoginChange}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
