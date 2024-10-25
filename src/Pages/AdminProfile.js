import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRoomToFirestore, updateRoomInFirestore, fetchRoomsFromFirestore } from '../redux/hotelSlice'; 
import { storage, db } from '../Firebase/firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function AdminProfile() {
    const dispatch = useDispatch();
    const [isAdmin, setIsAdmin] = useState(false);
    const [roomId, setRoomId] = useState('');
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
    const [amenityInput, setAmenityInput] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [reservations, setReservations] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        const checkAdminRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                setIsAdmin(idTokenResult.claims.admin || false);
                console.log('Admin Claim:', idTokenResult.claims.admin); // Debugging line
            }
        };

        checkAdminRole();
    }, [auth]);

    useEffect(() => {
        const fetchReservations = async () => {
            const reservationsRef = collection(db, 'reservations');
            const q = query(reservationsRef);
            onSnapshot(q, (snapshot) => {
                const reservationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReservations(reservationsData);
            });
        };

        fetchReservations();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoomDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAmenitiesChange = () => {
        if (amenityInput.trim()) {
            setRoomDetails((prevDetails) => ({
                ...prevDetails,
                amenities: [...prevDetails.amenities, amenityInput],
            }));
            setAmenityInput(''); // Clear input after adding
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setRoomDetails((prevDetails) => ({
            ...prevDetails,
            imageFiles: files,
        }));

        // Preview images
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviews(imageUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("You need to be logged in to add rooms.");
            return;
        }

        const token = await user.getIdTokenResult();
        console.log('Token claims:', token.claims); // Debugging line
        if (!token.claims.admin) {
            alert("You do not have permission to add rooms.");
            return;
        }

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

            if (roomId) {
                const roomRef = doc(db, 'rooms', roomId);
                await updateDoc(roomRef, roomData);
                dispatch(updateRoomInFirestore(roomData)); 
            } else {
                // Add new room
                await addDoc(collection(db, 'rooms'), roomData);
                dispatch(addRoomToFirestore(roomData));
            }

            alert(`Room ${roomId ? 'updated' : 'added'} successfully!`);
            resetForm();
        } catch (error) {
            console.error('Error processing room: ', error);
            alert('Failed to process room. Please try again later.');
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
            address: '',
            starRating: '',
            policies: '',
            mapLocation: '',
            imageFiles: [],
        });
        setImagePreviews([]); 
        setRoomId(''); 
    };

    const fetchRoomDetails = async (id) => {
        const roomRef = doc(db, 'rooms', id);
        const roomDoc = await getDoc(roomRef);
        if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            setRoomDetails(roomData);
            setRoomId(id);
            const imageUrls = roomData.images || [];
            setImagePreviews(imageUrls);
        } else {
            console.log('No such document!');
        }
    };

    const handleApproveReservation = async (reservationId) => {
        const reservationRef = doc(db, 'reservations', reservationId);
        await updateDoc(reservationRef, { status: 'approved' });
    };

    const handleCancelReservation = async (reservationId) => {
        const reservationRef = doc(db, 'reservations', reservationId);
        await updateDoc(reservationRef, { status: 'canceled' });
    };

    return (
        <>
            <Navbar />
            <div className="form-container">
                <h2>Admin Profile</h2>
                {/* Render the form and admin functionalities only for admins */}
                {isAdmin && (
                    <>
                        <form onSubmit={handleSubmit}>
                            <h2>{roomId ? 'Update Room' : 'Add New Room'}</h2>

                            <label>Select Room to Edit:</label>
                            <select onChange={(e) => fetchRoomDetails(e.target.value)}>
                                <option value="">--Select Room--</option>
                                {/* Populate room options here */}
                            </select>

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

                            <label>Amenities:</label>
                            <input
                                type="text"
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                placeholder="Add amenity"
                            />
                            <button type="button" onClick={handleAmenitiesChange}>Add Amenity</button>
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
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            <div className="image-previews">
                                {imagePreviews.map((image, index) => (
                                    <img key={index} src={image} alt={`Preview ${index}`} width="100" />
                                ))}
                            </div>

                            <button type="submit">{roomId ? 'Update Room' : 'Add Room'}</button>
                        </form>

                        <h3>Reservations</h3>
                        <ul>
                            {reservations.map((reservation) => (
                                <li key={reservation.id}>
                                    <span>{reservation.guestName} - {reservation.status}</span>
                                    <button onClick={() => handleApproveReservation(reservation.id)}>Approve</button>
                                    <button onClick={() => handleCancelReservation(reservation.id)}>Cancel</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {/* Display a message for non-admin users */}
                {!isAdmin && (
                    <p>Welcome! You can view your reservations here.</p>
                )}
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
