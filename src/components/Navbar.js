import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/navbar.css';

function Navbar({ isAuthenticated }) {
  return (
    <nav className="navbar">
      <div className="icon">
        <h1>HotelHub</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/adminhome"><i className="fas fa-home"></i> Home</Link></li>
        <li><Link to="/admindashboard"><i className="fas fa-hotel"></i> Dashboard</Link></li>
        <li><Link to="/adminprofile"><i className="fas fa-user"></i> Profile</Link></li>
        {isAuthenticated ? (
          <li><Link to="/adminlogout"><i className="fas fa-sign-out-alt"></i> Logout</Link></li>
        ) : (
          <>
            <li><Link to="/adminlogin"><i className="fas fa-sign-in-alt"></i> Login</Link></li>
            <li><Link to="/adminsignup"><i className="fas fa-user-plus"></i> Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

