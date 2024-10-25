import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addRoomToFirestore, fetchRoomsFromFirestore } from '../redux/hotelSlice';
import { auth, storage } from '../Firebase/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [roomDetails, setRoomDetails] = useState({
    name: '',
    price: '',
    description: '',
    breakfastIncluded: false,
    availability: true,
    amenities: [],
    facilities: '',
    policies: '',
    address: '', // Added address field
    starRating: 0, // Added star rating field
  });
  const [imageUpload, setImageUpload] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You need to be logged in to add rooms.");
      return;
    }

    const token = await user.getIdTokenResult();
    if (!token.claims.admin) {
      alert("You do not have permission to add rooms.");
      return;
    }

    let imageURL = '';
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      imageURL = await getDownloadURL(snapshot.ref);
    }

    const roomData = {
      ...roomDetails,
      price: parseFloat(roomDetails.price),
      imageUrl: imageURL,
    };

    try {
      const response = await dispatch(addRoomToFirestore(roomData));
      console.log('Room added with ID:', response.payload.id);
      alert("Room added successfully!");
      resetForm();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room. Please check the console for more details.');
    }
  };

  const resetForm = () => {
    setRoomDetails({
      name: '',
      price: '',
      description: '',
      breakfastIncluded: false,
      availability: true,
      amenities: [],
      facilities: '',
      policies: '',
      address: '', // Reset address
      starRating: 0, // Reset star rating
    });
    setImageUpload(null); 
  };

  useEffect(() => {
    dispatch(fetchRoomsFromFirestore());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomDetails.name}
          onChange={(e) => setRoomDetails({ ...roomDetails, name: e.target.value })}
          placeholder="Room Name"
          required
        />
        <input
          type="number"
          value={roomDetails.price}
          onChange={(e) => setRoomDetails({ ...roomDetails, price: e.target.value })}
          placeholder="Price"
          required
        />
        <textarea
          value={roomDetails.description}
          onChange={(e) => setRoomDetails({ ...roomDetails, description: e.target.value })}
          placeholder="Description"
          required
        />
        <textarea
          value={roomDetails.facilities}
          onChange={(e) => setRoomDetails({ ...roomDetails, facilities: e.target.value })}
          placeholder="Facilities (e.g., WiFi, Pool, Parking)"
          required
        />
        <textarea
          value={roomDetails.policies}
          onChange={(e) => setRoomDetails({ ...roomDetails, policies: e.target.value })}
          placeholder="Policies (e.g., Check-in, Check-out times)"
          required
        />
        <input
          type="text"
          value={roomDetails.address}
          onChange={(e) => setRoomDetails({ ...roomDetails, address: e.target.value })}
          placeholder="Address"
          required
        />
        <input
          type="number"
          value={roomDetails.starRating}
          onChange={(e) => setRoomDetails({ ...roomDetails, starRating: e.target.value })}
          placeholder="Star Rating (0-5)"
          min="0"
          max="5"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={roomDetails.breakfastIncluded}
            onChange={(e) => setRoomDetails({ ...roomDetails, breakfastIncluded: e.target.checked })}
          />
          Breakfast Included
        </label>
        <label>
          <input
            type="checkbox"
            checked={roomDetails.availability}
            onChange={(e) => setRoomDetails({ ...roomDetails, availability: e.target.checked })}
          />
          Available
        </label>
        <button type="submit">Add Room</button>
      </form>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
