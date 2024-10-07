import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoom } from '../redux/hotelSlice'; // Updated import to match the action
import { db } from '../Firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/footer.css';

function AdminProfile() {
    const dispatch = useDispatch();

    // State to hold room details
    const [roomDetails, setRoomDetails] = useState({
        name: '',
        price: '',
        breakfastIncluded: false,
        amenities: [],
        image: '',
    });

    // Handler to update state based on user input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (checked) {
                setRoomDetails((prev) => ({
                    ...prev,
                    amenities: [...prev.amenities, name],
                }));
            } else {
                setRoomDetails((prev) => ({
                    ...prev,
                    amenities: prev.amenities.filter((amenity) => amenity !== name),
                }));
            }
        } else {
            setRoomDetails((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handler to submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const roomData = {
                ...roomDetails,
                price: parseFloat(roomDetails.price), // Ensure price is a number
            };
            const docRef = await addDoc(collection(db, 'rooms'), roomData);
            console.log('Document written with ID: ', docRef.id);
            // Dispatch the addRoom action to update the Redux state
            dispatch(addRoom({ id: docRef.id, ...roomData }));
            // Reset form after submission
            setRoomDetails({
                name: '',
                price: '',
                breakfastIncluded: false,
                amenities: [],
                image: '',
            });
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-profile-container">
                <h2>Add New Room</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Room Name:
                        <input type="text" name="name" value={roomDetails.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Price:
                        <input type="number" name="price" value={roomDetails.price} onChange={handleChange} required />
                    </label>
                    <label>
                        Breakfast Included:
                        <input 
                            type="checkbox" 
                            name="breakfastIncluded" 
                            checked={roomDetails.breakfastIncluded} 
                            onChange={(e) => setRoomDetails({ ...roomDetails, breakfastIncluded: e.target.checked })} 
                        />
                    </label>
                    <label>
                        Image URL:
                        <input type="text" name="image" value={roomDetails.image} onChange={handleChange} required />
                    </label>
                    <div>
                        Amenities:
                        <label>
                            <input type="checkbox" name="wifi" checked={roomDetails.amenities.includes('wifi')} onChange={handleChange} />
                            Wi-Fi
                        </label>
                        <label>
                            <input type="checkbox" name="parking" checked={roomDetails.amenities.includes('parking')} onChange={handleChange} />
                            Parking
                        </label>
                        <label>
                            <input type="checkbox" name="swimmingPool" checked={roomDetails.amenities.includes('swimmingPool')} onChange={handleChange} />
                            Swimming Pool
                        </label>
                    </div>
                    <button type="submit">Add Room</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default AdminProfile;
