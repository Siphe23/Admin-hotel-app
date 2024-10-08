import React, { useState } from 'react';
import { db } from '../Firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import '../assets/footer.css'; 

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    try {
      await addDoc(collection(db, 'subscriptions'), {
        email: email,
      });
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <footer>
      <div className="footer-container">
        <div className="contact-info">
          <h4>Contact Us</h4>
          <p>Email: info@hotelhub.com</p>
          <p>Phone: +27 123 456 789</p>
        </div>

        <div className="socials">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/path-to-your-icons/facebook-icon.png" alt="Facebook" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/path-to-your-icons/twitter-icon.png" alt="Twitter" />
          </a>
        </div>

        <div className="newsletter">
          <h4>Subscribe to our Newsletter</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>

      <div className="bottom-footer">
        <ul className="footer-nav">
          <li><a href="/adminhome">Home</a></li>
          <li><a href="/admindashboard">Dashboard</a></li>
          <li><a href="/adminprofile">Profile</a></li>
          <li><a href="/adminlogin">Login</a></li>
          <li><a href="/adminsignup">Sign Up</a></li>
        </ul>
        <p>© 2024 Your Company Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
