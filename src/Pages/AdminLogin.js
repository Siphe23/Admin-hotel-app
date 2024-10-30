import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { auth } from '../Firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import '../assets/auth.css';

function AdminLogin({ onLogin }) { // Add onLogin prop
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
            const userCredential = await signInWithEmailAndPassword(auth, loginDetails.email, loginDetails.password);
            const user = userCredential.user;

            // Dispatch user role to Redux store (assume admin)
            dispatch(login({ role: 'admin' }));
            setSuccessMessage('Login successful!');
            setLoginDetails({ email: '', password: '' }); // Reset form fields
            onLogin(); // Call onLogin to update the authentication state
            navigate('/adminhome'); // Redirect to home after login

        } catch (error) {
            console.error('Error logging in: ', error);
            if (error.code === 'auth/user-not-found') {
                setErrorMessage('No user found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                setErrorMessage('Incorrect password. Please try again.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            
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
            
        </>
    );
}

export default AdminLogin;
