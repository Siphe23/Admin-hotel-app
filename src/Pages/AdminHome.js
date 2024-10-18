import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebase'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/home.css';
import { useRatings } from '../context/RatingsContext'; // Import the context

function AdminHome() {
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { userRatings } = useRatings(); // Get user ratings from context
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'your-image-path/'); // Adjust path to your images
        const imageList = await listAll(imagesRef);
        const urls = await Promise.all(imageList.items.map(item => getDownloadURL(item)));
        setBackgroundImages(urls);
        setLoadingImages(false); // Set loading to false once images are fetched
      } catch (error) {
        console.error('Error fetching background images:', error);
        setLoadingImages(false); // Ensure loading state is false even if there's an error
      }
    };

    fetchImages();

    // Cycle through images every 5 seconds if multiple images are available
    const imageInterval = backgroundImages.length > 1 ? setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000) : null;

    return () => {
      if (imageInterval) clearInterval(imageInterval); // Clean up interval on unmount
    };
  }, [backgroundImages]);

  return (
    <>
      <Navbar />
      <div
        className="admin-home-container"
        style={{
          backgroundImage: loadingImages ? 'none' : `url(${backgroundImages[currentImageIndex] || ''})`,
          backgroundSize: 'cover',      
          backgroundPosition: 'center',  
          backgroundRepeat: 'no-repeat', 
          height: '100vh',             
        }}
      >
        {loadingImages ? (
          <p>Loading images...</p> // Feedback while loading images
        ) : (
          <>
            <header className="welcome-section">
              <h1>Welcome to the Admin Home Page</h1>
              <p>Manage your application from this central location.</p>
            </header>

            <section className="overview-section">
              <h2>Overview</h2>
              <p>From here, you can quickly access your admin dashboard, manage users, view system statistics, and more.</p>
              
              {/* Display user ratings */}
              <h2>User Ratings</h2>
              {Object.keys(userRatings).length > 0 ? ( // Check if userRatings is not empty
                <ul>
                  {Object.entries(userRatings).map(([offerId, rating]) => (
                    <li key={offerId}>Offer ID: {offerId} - Rating: {rating}</li>
                  ))}
                </ul>
              ) : (
                <p>No user ratings available.</p> // Provide feedback if no ratings
              )}

              <div className="quick-links">
                <a href="/admindashboard" className="quick-link">Go to Dashboard</a>
                <a href="/adminprofile" className="quick-link">View Profile</a>
              </div>
            </section>

            <section className="recent-updates">
              <h2>Recent Updates</h2>
              <ul>
                <li>New user registration system implemented</li>
                <li>Bug fixes and performance improvements</li>
                <li>New analytics features available in the dashboard</li>
              </ul>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminHome;
