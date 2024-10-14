import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoom } from '../redux/hotelSlice';
import { db, storage } from '../Firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/footer.css';
import '../assets/AdminProfile.css'; 

function AdminProfile() {
    const dispatch = useDispatch();

    const [roomDetails, setRoomDetails] = useState({
        name: '',
        price: '',
        breakfastIncluded: false,
        amenities: [],
        imageFile: null,  
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'file') {
            setRoomDetails((prev) => ({ ...prev, imageFile: e.target.files[0] })); 
        } else if (type === 'checkbox') {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = '';

            if (roomDetails.imageFile) {
                const storageRef = ref(storage, `room-images/${roomDetails.imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, roomDetails.imageFile);
                imageUrl = await getDownloadURL(snapshot.ref); 
            }

            const { imageFile, ...roomDataWithoutImage } = roomDetails; 

            const roomData = {
                ...roomDataWithoutImage,
                price: parseFloat(roomDetails.price),
                image: imageUrl,  
            };

            const docRef = await addDoc(collection(db, 'rooms'), roomData);
            console.log('Document written with ID: ', docRef.id);

            dispatch(addRoom({ id: docRef.id, ...roomData }));

       
            setRoomDetails({
                name: '',
                price: '',
                breakfastIncluded: false,
                amenities: [],
                imageFile: null,
            });

            alert("Room added successfully!");
        } catch (error) {
            console.error('Error adding room: ', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-profile-container">
                <h2>Add New Room</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="roomName">
                        Room Name:
                        <input type="text" id="roomName" name="name" autoComplete="off" value={roomDetails.name} onChange={handleChange} required />
                    </label>
                    <label htmlFor="roomPrice">
                        Price:
                        <input type="number" id="roomPrice" name="price" value={roomDetails.price} onChange={handleChange} required />
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
                    <label htmlFor="roomImage">
                        Room Image:
                        <input type="file" id="roomImage" accept="image/*" name="imageFile" onChange={handleChange} required />
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
