import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction } from '../redux/authSlice'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/auth.css'; 

import '../assets/footer.css';

import { auth } from '../Firebase/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    userType: 'admin', 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true); 
    setError(''); 

    console.log("Login Details:", loginDetails); 

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
      setError(getErrorMessage(error.code)); 
    } finally {
      setLoading(false); 
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'Login failed. Please check your credentials.';
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Admin Login</h2>
        {error && <div className="error-message">{error}</div>} 
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            id="email" 
            value={loginDetails.email} 
            onChange={handleLoginChange} 
            placeholder="Enter your email" 
            required 
            disabled={loading} 
            aria-label="Email"
          />
          <input 
            type="password" 
            id="password" 
            value={loginDetails.password} 
            onChange={handleLoginChange} 
            placeholder="Enter your password" 
            required 
            disabled={loading} 
            aria-label="Password"
          />
          <select 
            id="userType" 
            value={loginDetails.userType} 
            onChange={handleLoginChange}
            disabled={loading}
            aria-label="User Type"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} 
          </button>
        </form>
       
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
