import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRoomToFirestore, fetchRoomsFromFirestore } from '../redux/hotelSlice';
import { auth } from '../Firebase/firebase';
import { storage } from '../Firebase/firebase'; // Import Firebase storage for image uploads
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage methods

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
  });
  const [imageUpload, setImageUpload] = useState(null); // For storing the image to upload
  const [imageURL, setImageURL] = useState(''); // For storing the image URL from Firebase

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

    // Handle image upload if an image is selected
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageURL(url); // Set the image URL for Firestore
        });
      });
    }

    const roomData = {
      name: roomDetails.name,
      price: parseFloat(roomDetails.price),
      description: roomDetails.description,
      breakfastIncluded: roomDetails.breakfastIncluded,
      availability: roomDetails.availability,
      amenities: roomDetails.amenities.length > 0 ? roomDetails.amenities : [],
      facilities: roomDetails.facilities,  // Hotel facilities field
      policies: roomDetails.policies,      // Hotel policies field
      imageUrl: imageURL,  // Store the image URL from Firebase Storage
    };

    try {
      const response = await dispatch(addRoomToFirestore(roomData));
      console.log('Room added with ID:', response.payload.id);
      alert("Room added successfully!");
      setRoomDetails({
        name: '',
        price: '',
        description: '',
        breakfastIncluded: false,
        availability: true,
        amenities: [],
        facilities: '',
        policies: '',
      });
      setImageUpload(null); // Reset the image upload field
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room. Please check the console for more details.');
    }
  };

  // Fetch rooms when the component mounts
  useEffect(() => {
    dispatch(fetchRoomsFromFirestore());
  }, [dispatch]);

  return (
    <div>
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit}>
        {/* Room Name */}
        <input
          type="text"
          value={roomDetails.name}
          onChange={(e) => setRoomDetails({ ...roomDetails, name: e.target.value })}
          placeholder="Room Name"
          required
        />

        {/* Room Price */}
        <input
          type="number"
          value={roomDetails.price}
          onChange={(e) => setRoomDetails({ ...roomDetails, price: e.target.value })}
          placeholder="Price"
          required
        />

        {/* Room Description */}
        <textarea
          value={roomDetails.description}
          onChange={(e) => setRoomDetails({ ...roomDetails, description: e.target.value })}
          placeholder="Description"
          required
        />

        {/* Hotel Facilities */}
        <textarea
          value={roomDetails.facilities}
          onChange={(e) => setRoomDetails({ ...roomDetails, facilities: e.target.value })}
          placeholder="Facilities (e.g., WiFi, Pool, Parking)"
          required
        />

        {/* Hotel Policies */}
        <textarea
          value={roomDetails.policies}
          onChange={(e) => setRoomDetails({ ...roomDetails, policies: e.target.value })}
          placeholder="Policies (e.g., Check-in, Check-out times)"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
          required
        />

        {/* Breakfast Included */}
        <label>
          <input
            type="checkbox"
            checked={roomDetails.breakfastIncluded}
            onChange={(e) => setRoomDetails({ ...roomDetails, breakfastIncluded: e.target.checked })}
          />
          Breakfast Included
        </label>

        {/* Room Availability */}
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
    </div>
  );
};

export default AdminDashboard;
