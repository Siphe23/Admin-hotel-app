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
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, loginDetails.email, loginDetails.password);
      const user = userCredential.user;

      // Check if user has admin claim
      const token = await user.getIdTokenResult();
      if (token.claims.admin) {
        // Dispatch admin role to Redux store
        dispatch(login({ role: 'admin' }));
        setSuccessMessage('Login successful!');
        setLoginDetails({ email: '', password: '' }); // Reset form fields
        navigate('/admindashboard'); // Redirect to admin dashboard
      } else {
        setErrorMessage('You do not have permission to access the admin dashboard.');
        auth.signOut(); // Optionally sign out the user
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
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
          disabled={loading} // Disable input during loading
        />
        <input
          type="password"
          id="password"
          value={loginDetails.password}
          onChange={handleLoginChange}
          placeholder="Enter your password"
          required
          disabled={loading} // Disable input during loading
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
