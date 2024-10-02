import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as needed
import Footer from '../components/Footer'; // Adjust the path as needed
import '../assets/dashboard.css'; // Optional: Create a CSS file for styles

function AdminDashboard() {
    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <aside className="sidebar">
                    <h2>Admin Menu</h2>
                    <ul>
                        <li><a href="/adminhome">Home</a></li>
                        <li><a href="/admindashboard">Dashboard</a></li>
                        <li><a href="/adminprofile">Profile</a></li>
                        <li><a href="/adminlogout">Logout</a></li>
                    </ul>
                </aside>
                <main className="main-content">
                    <h1>Welcome to the Admin Dashboard</h1>
                    <p>Here you can manage your application settings, view reports, and more.</p>
                    {/* Add your dashboard widgets or components here */}
                </main>
            </div>
            <Footer />
        </>
    );
}

export default AdminDashboard;
