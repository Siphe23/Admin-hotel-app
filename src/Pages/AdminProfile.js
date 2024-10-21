import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoomToFirestore } from '../redux/hotelSlice';
import { storage, db } from '../Firebase/firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

function AdminProfile() {
    const dispatch = useDispatch();
    const [isAdmin, setIsAdmin] = useState(false);
    const [roomDetails, setRoomDetails] = useState({
        name: '',
        price: '',
        description: '',
        breakfastIncluded: false,
        availability: true,
        amenities: [],
        address: '',
        starRating: '',
        policies: '',
        mapLocation: '',
        imageFiles: [],
    });

    const auth = getAuth(); // Get auth instance

    useEffect(() => {
        const checkAdminRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                setIsAdmin(idTokenResult.claims.admin || false);
            }
        };

        checkAdminRole();
    }, [auth]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoomDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAmenitiesChange = (e) => {
        const { value } = e.target;
        setRoomDetails((prevDetails) => ({
            ...prevDetails,
            amenities: prevDetails.amenities.includes(value)
                ? prevDetails.amenities.filter((amenity) => amenity !== value)
                : [...prevDetails.amenities, value],
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setRoomDetails((prevDetails) => ({
            ...prevDetails,
            imageFiles: files,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const imageUrls = await Promise.all(
                roomDetails.imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `room-images/${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    return await getDownloadURL(snapshot.ref);
                })
            );

            const { imageFiles, ...roomDataWithoutImage } = roomDetails;

            const roomData = {
                ...roomDataWithoutImage,
                price: parseFloat(roomDetails.price),
                images: imageUrls,
            };

            // Add room to Firestore
            await addDoc(collection(db, 'rooms'), roomData);

            // Dispatch Redux action
            dispatch(addRoomToFirestore(roomData));

            // Reset form after submission
            setRoomDetails({
                name: '',
                price: '',
                description: '',
                breakfastIncluded: false,
                availability: true,
                amenities: [],
                address: '',
                starRating: '',
                policies: '',
                mapLocation: '',
                imageFiles: [],
            });

            alert('Room added successfully!');
        } catch (error) {
            console.error('Error adding room: ', error);
            alert('Failed to add room. Please try again later.');
        }
    };

    if (!isAdmin) {
        return <p>You do not have permission to access this page.</p>; // Show message if user is not admin
    }

    return (
        <>
            <Navbar />
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Add New Room</h2>

                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={roomDetails.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Price (per night):</label>
                    <input
                        type="number"
                        name="price"
                        value={roomDetails.price}
                        onChange={handleChange}
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={roomDetails.description}
                        onChange={handleChange}
                        required
                    />

                    <label>Breakfast Included:</label>
                    <input
                        type="checkbox"
                        name="breakfastIncluded"
                        checked={roomDetails.breakfastIncluded}
                        onChange={handleChange}
                    />

                    <label>Availability:</label>
                    <input
                        type="checkbox"
                        name="availability"
                        checked={roomDetails.availability}
                        onChange={handleChange}
                    />

                    <label>Amenities (e.g. Wi-Fi, Pool):</label>
                    <input
                        type="text"
                        value=""
                        placeholder="Add amenity"
                        onBlur={handleAmenitiesChange}
                    />
                    <ul>
                        {roomDetails.amenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                        ))}
                    </ul>

                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={roomDetails.address}
                        onChange={handleChange}
                        required
                    />

                    <label>Star Rating (1-5):</label>
                    <input
                        type="number"
                        name="starRating"
                        value={roomDetails.starRating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />

                    <label>Hotel Policies:</label>
                    <textarea
                        name="policies"
                        value={roomDetails.policies}
                        onChange={handleChange}
                        required
                    />

                    <label>Upload Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                    />

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
