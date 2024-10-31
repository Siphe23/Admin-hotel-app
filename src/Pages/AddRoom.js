import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsFromFirestore, addRoomToFirestore, updateRoomInFirestore, deleteRoomFromFirestore } from '../redux/hotelSlice'; 

const AddRoom = () => {
    const dispatch = useDispatch();
    const rooms = useSelector(state => state.hotel.rooms || []); 
    const [roomDetails, setRoomDetails] = useState({
        roomName: '',
        price: '',
        description: '',
        amenities: [],
        imageFiles: [],
    });
    const [editingRoomId, setEditingRoomId] = useState(null);

    useEffect(() => {
        dispatch(fetchRoomsFromFirestore());
    }, [dispatch]);

    const handleAmenityChange = (e) => {
        const { value, checked } = e.target;
        setRoomDetails(prevDetails => {
            const amenities = checked
                ? [...prevDetails.amenities, value]
                : prevDetails.amenities.filter(amenity => amenity !== value);
            return { ...prevDetails, amenities };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setRoomDetails(prevDetails => ({
            ...prevDetails,
            imageFiles: [...prevDetails.imageFiles, ...files],
        }));
    };

    const handleImageDelete = (index) => {
        setRoomDetails(prevDetails => {
            const updatedFiles = prevDetails.imageFiles.filter((_, i) => i !== index);
            return { ...prevDetails, imageFiles: updatedFiles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { roomName, price, description, amenities, imageFiles } = roomDetails;

        // Create FormData to handle image uploads
        const roomData = new FormData();
        roomData.append('roomName', roomName);
        roomData.append('price', parseFloat(price)); // Ensure price is a number
        roomData.append('description', description);
        roomData.append('amenities', JSON.stringify(amenities));

        // Append image files to the FormData
        imageFiles.forEach(file => {
            roomData.append('images', file);
        });

        try {
            if (editingRoomId) {
                await dispatch(updateRoomInFirestore({ id: editingRoomId, roomData }));
                console.log("Room updated successfully!");
            } else {
                await dispatch(addRoomToFirestore(roomData));
                console.log("Room added successfully!");
            }
            resetForm();
        } catch (error) {
            console.error("Error processing room:", error);
        }
    };

    const handleEdit = (room) => {
        setRoomDetails({
            roomName: room.roomName,
            price: room.price,
            description: room.description,
            amenities: room.amenities,
            imageFiles: [], // Set this to an empty array because we will display existing images
        });
        setEditingRoomId(room.id);
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteRoomFromFirestore(id));
            console.log("Room deleted successfully!");
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    const resetForm = () => {
        setRoomDetails({
            roomName: '',
            price: '',
            description: '',
            amenities: [],
            imageFiles: [],
        });
        setEditingRoomId(null);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>{editingRoomId ? 'Edit Room' : 'Add Room'}</h2>
                <div>
                    <label>Room Name:</label>
                    <input type="text" name="roomName" value={roomDetails.roomName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={roomDetails.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={roomDetails.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Amenities:</label>
                    <div>
                        {['WiFi', 'Breakfast', 'Air Conditioning'].map(amenity => (
                            <label key={amenity}>
                                <input
                                    type="checkbox"
                                    value={amenity}
                                    checked={roomDetails.amenities.includes(amenity)}
                                    onChange={handleAmenityChange}
                                />
                                {amenity}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Images:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} multiple />
                    <div>
                        {roomDetails.imageFiles.length > 0 && (
                            <div>
                                <h3>Selected Images:</h3>
                                {roomDetails.imageFiles.map((file, index) => (
                                    <div key={index}>
                                        <span>{file.name}</span>
                                        <button type="button" onClick={() => handleImageDelete(index)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit">{editingRoomId ? 'Update' : 'Add'} Room</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>

            <h2>Room List</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>
                        <div>
                            <h3>{room.roomName} - {room.price}</h3>
                            <p>{room.description}</p>
                            {room.imageUrls && room.imageUrls.length > 0 && (
                                <div>
                                    <h4>Room Images:</h4>
                                    {room.imageUrls.map((imageUrl, index) => (
                                        <img key={index} src={imageUrl} alt={`Room Image ${index}`} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                                    ))}
                                </div>
                            )}
                            <button onClick={() => handleEdit(room)}>Edit</button>
                            <button onClick={() => handleDelete(room.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddRoom; // Ensure this is a default export
