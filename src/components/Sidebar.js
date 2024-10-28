import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css';


function Sidebar() {
    return (
      

            <div className="sidebar">
                <h3>Admin Menu</h3>
                <ul>
                    <li><Link to="/adminprofile">Admin Profile</Link></li>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/adminlogin">Admin Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/addrooms">Add Rooms</Link></li>
                    <li><Link to="/admindashboard">Dashboard</Link></li>
                    <li><Link to="/signout">Sign Out</Link></li>
                </ul>
            </div>
      
    );
}

export default Sidebar;

