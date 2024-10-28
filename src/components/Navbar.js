import React from 'react'; 
import { Link } from 'react-router-dom';
import '../assets/navbar.css'; // Adjust the CSS path as necessary

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <div className="icon">
        <h1>HotelHub</h1>
      </div>
      <ul className="nav-links">
        {/* Common Home link for all users */}
        <li><Link to="/adminhome"><i className="fas fa-home"></i> Home</Link></li>

        {/* Links visible when authenticated */}
        {isAuthenticated && (
          <>
            <li><Link to="/admindashboard"><i className="fas fa-hotel"></i> Dashboard</Link></li>
            <li><Link to="/adminprofile"><i className="fas fa-user"></i> Profile</Link></li>
            <li><Link to="/addroom"><i className="fas fa-plus"></i> Add Rooms</Link></li>
          </>
        )}

        {/* Logout button or Login/Signup links based on authentication status */}
        {isAuthenticated ? (
          <li>
            <button onClick={onLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
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

export default Navbar; // Ensure this export is present
