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

            // Reset form after submission
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
            alert('Failed to add room. Please try again later.');
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
                        <input 
                            type="text" 
                            id="roomName" 
                            name="name" 
                            autoComplete="off" 
                            value={roomDetails.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label htmlFor="roomPrice">
                        Price:
                        <input 
                            type="number" 
                            id="roomPrice" 
                            name="price" 
                            value={roomDetails.price} 
                            onChange={handleChange} 
                            required 
                        />
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
                        <input 
                            type="file" 
                            id="roomImage" 
                            accept="image/*" 
                            name="imageFile" 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <div>
                        Amenities:
                        <label>
                            <input 
                                type="checkbox" 
                                name="wifi" 
                                checked={roomDetails.amenities.includes('wifi')} 
                                onChange={handleChange} 
                            />
                            Wi-Fi
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="parking" 
                                checked={roomDetails.amenities.includes('parking')} 
                                onChange={handleChange} 
                            />
                            Parking
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="swimmingPool" 
                                checked={roomDetails.amenities.includes('swimmingPool')} 
                                onChange={handleChange} 
                            />
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

// import { useDispatch, useSelector } from 'react-redux';
// import { addRoom, updateRoom, deleteRoom, setRooms, fetchRooms } from '../redux/hotelSlice'; 
// import { db } from '../Firebase/firebase'; 
// import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; 
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import '../assets/footer.css';
// import '../assets/AdminProfile.css'; 

// function AdminProfile() {
//     const dispatch = useDispatch();
//     const { rooms, loading, error } = useSelector((state) => state.hotel); // Correctly access hotel state
//     const [roomDetails, setRoomDetails] = useState({
//         name: '',
//         price: '',
//         breakfastIncluded: false,
//         amenities: [],
//         imageFile: null,  
//     });

//     const fetchRooms = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, 'rooms'));
//             const rooms = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             dispatch(setRooms(rooms)); 
//         } catch (error) {
//             console.error('Error fetching rooms:', error);
//         }
//     };

//     useEffect(() => {
//         fetchRooms(); 
//     }, []); 

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setRoomDetails(prevDetails => ({
//             ...prevDetails,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Your existing code for adding/updating rooms will go here
//     };

//     const handleDelete = async (roomId) => {
//         try {
//             await deleteDoc(doc(db, 'rooms', roomId)); 
//             dispatch(deleteRoom(roomId)); 
//             alert('Room deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting room:', error);
//         }
//     };

//     const handleEdit = (roomId) => {
//         const existingRoom = rooms.find(room => room.id === roomId);
//         if (existingRoom) {
//             setRoomDetails(existingRoom); 
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="admin-profile-container">
//                 <h2>{roomDetails.id ? "Edit Room" : "Add New Room"}</h2>
//                 <form onSubmit={handleSubmit}>
//                     {/* Add input fields for room details */}
//                     <button type="submit">{roomDetails.id ? "Update Room" : "Add Room"}</button>
//                 </form>
//                 {loading && <p>Loading rooms...</p>}
//                 {error && <p>Error loading rooms: {error}</p>}
//                 <div className="room-list">
//                     {rooms.map(room => (
//                         <div key={room.id}>
//                             <h3>{room.name}</h3>
//                             <button onClick={() => handleEdit(room.id)}>Edit</button>
//                             <button onClick={() => handleDelete(room.id)}>Delete</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// }

// export default AdminProfile;
