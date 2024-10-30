import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoomToFirestore } from '../redux/hotelSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `rooms/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    });
    return Promise.all(uploadPromises);
};

function AddRoom() {
    const dispatch = useDispatch();
    const [roomDetails, setRoomDetails] = useState({
        roomName: '',
        price: '',
        description: '',
        amenities: [],
        imageFiles: [],
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageUrls = await uploadImages(roomDetails.imageFiles);
            const roomData = {
                ...roomDetails,
                imageFiles: imageUrls,
            };
            await dispatch(addRoomToFirestore(roomData)).unwrap();
            alert('Room added successfully!');
            setRoomDetails({ roomName: '', price: '', description: '', amenities: [], imageFiles: [] });
        } catch (error) {
            alert('Failed to add room: ' + error.message);
        }
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
                    {['WiFi', 'Breakfast', 'Parking'].map((amenity) => (
                        <label key={amenity}>
                            <input
                                type="checkbox"
                                value={amenity}
                                onChange={handleAmenityChange}
                            /> {amenity}
                        </label>
                    ))}
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
