import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoomToFirestore } from '../redux/hotelSlice'; // Adjust the path as necessary
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AddRoom() {
    const dispatch = useDispatch();
    const [roomDetails, setRoomDetails] = useState({
        roomName: '',
        price: '',
        description: '',
        amenities: [],
        imageFiles: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(addRoomToFirestore(roomDetails)).unwrap();
            alert('Room added successfully!');
            setRoomDetails({ roomName: '', price: '', description: '', amenities: [], imageFiles: [] });
        } catch (error) {
            alert('Failed to add room: ' + error.message);
        }
    };

    const handleAmenityChange = (e) => {
        const { value, checked } = e.target;
        setRoomDetails((prevDetails) => {
            const amenities = checked
                ? [...prevDetails.amenities, value]
                : prevDetails.amenities.filter((amenity) => amenity !== value);
            return { ...prevDetails, amenities };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setRoomDetails((prevDetails) => ({ ...prevDetails, imageFiles: files }));
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h2>Add New Room</h2>

                <label>Room Name:</label>
                <input
                    type="text"
                    value={roomDetails.roomName}
                    onChange={(e) => setRoomDetails({ ...roomDetails, roomName: e.target.value })}
                    required
                />

                <label>Price:</label>
                <input
                    type="number"
                    value={roomDetails.price}
                    onChange={(e) => setRoomDetails({ ...roomDetails, price: e.target.value })}
                    required
                />

                <label>Description:</label>
                <textarea
                    value={roomDetails.description}
                    onChange={(e) => setRoomDetails({ ...roomDetails, description: e.target.value })}
                    required
                />

                <label>Amenities:</label>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="WiFi"
                            onChange={handleAmenityChange}
                        /> WiFi
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Breakfast"
                            onChange={handleAmenityChange}
                        /> Breakfast
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Parking"
                            onChange={handleAmenityChange}
                        /> Parking
                    </label>
                </div>

                <label>Images:</label>
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                />

                <button type="submit">Add Room</button>
            </form>
            <Footer />
        </>
    );
}

export default AddRoom;
