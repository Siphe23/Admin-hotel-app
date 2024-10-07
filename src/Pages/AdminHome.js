import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase'; // Ensure your firebase configuration is correct
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/home.css';

function AdminHome() {
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch background images from Firebase
  useEffect(() => {
    const imagesRef = ref(storage, 'Background-images/'); // Replace 'Background-images' with the folder name in your Firebase storage

    listAll(imagesRef)
      .then((result) => {
        const imageUrlsPromises = result.items.map((item) => getDownloadURL(item));
        Promise.all(imageUrlsPromises).then((urls) => {
          setBackgroundImages(urls);
        });
      })
      .catch((error) => {
        console.error("Error fetching background images:", error);
      });
  }, []);

  // Slideshow logic: Change the background every 5 seconds
  useEffect(() => {
    if (backgroundImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 5000); // Change the image every 5 seconds

      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [backgroundImages]);

  return (
    <>
      <Navbar />
      <div
        className="admin-home-container"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',       // Ensures the background covers the entire area
          backgroundPosition: 'center',  // Centers the background image
          backgroundRepeat: 'no-repeat', // Prevents the background from repeating
          height: '100vh',               // Full height of the viewport
        }}
      >
        <header className="welcome-section">
          <h1>Welcome to the Admin Home Page</h1>
          <p>Manage your application from this central location.</p>
        </header>

        <section className="overview-section">
          <h2>Overview</h2>
          <p>From here, you can quickly access your admin dashboard, manage users, view system statistics, and more.</p>

          <div className="quick-links">
            <a href="/admindashboard" className="quick-link">Go to Dashboard</a>
            <a href="/adminprofile" className="quick-link">View Profile</a>
          </div>
        </section>

        <section className="recent-updates">
          <h2>Recent Update rooms</h2>
          <ul>
            <li>New user registration system implemented</li>
            <li>Bug fixes and performance improvements</li>
            <li>New analytics features available in the dashboard</li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default AdminHome;
