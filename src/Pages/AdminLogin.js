import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { auth } from '../Firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import '../assets/auth.css';

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );
      const user = userCredential.user;

      // Dispatch the login action with user data or role
      dispatch(login({ role: 'admin' })); // Adjust according to your user type handling
      setSuccessMessage('Login successful!');

      // Redirect to the admin dashboard
      navigate('/admindashboard'); // Redirect here

    } catch (error) {
      console.error('Error logging in: ', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Navbar />
      <h2>Login to your account</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/adminsignup">Sign Up</Link>
      </p>
      <Footer />
    </>
  );
}

export default AdminLogin;
