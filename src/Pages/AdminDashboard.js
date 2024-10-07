import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRoom, updateRoom, deleteRoom, fetchRooms } from '../redux/hotelSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/dashboard.css'; // Ensure this path is correct

function AdminDashboard() {
  const dispatch = useDispatch();
  const { rooms = [], loading, error } = useSelector((state) => state.hotel); // Provide a default value for rooms

  // State for managing form inputs (consider renaming these if necessary)
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomStatus, setRoomStatus] = useState('booked'); // default to 'booked' for displaying booked rooms
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomData = {
      name: roomName,
      price: roomPrice,
      status: roomStatus,
    };

    if (editingRoomId) {
      // Update existing room
      dispatch(updateRoom({ id: editingRoomId, data: roomData }));
      setEditingRoomId(null); // Reset editing state
    } else {
      // Add new room (if necessary, otherwise remove this block)
      dispatch(addRoom(roomData));
    }

    // Clear form inputs
    setRoomName('');
    setRoomPrice('');
    setRoomStatus('booked'); // Reset to booked after submission
  };

  const handleEdit = (room) => {
    setRoomName(room.name);
    setRoomPrice(room.price);
    setRoomStatus(room.status);
    setEditingRoomId(room.id);
  };

  const handleDelete = (roomId) => {
    dispatch(deleteRoom(roomId));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Admin Menu</h2>
          <ul>
            <li><a href="/adminhome">Home</a></li>
            <li><a href="/admindashboard">Dashboard</a></li>
            <li><a href="/adminprofile">Profile</a></li>
            <li><a href="/adminlogout">Logout</a></li>
          </ul>
        </aside>
        <main className="main-content">
          <h1>Welcome to the Admin Dashboard</h1>
          <p>Here you can manage your application settings, view reports, and more.</p>

          {/* Display loading or error messages */}
          {loading && <p>Loading rooms...</p>}
          {error && <p>Error loading rooms: {error}</p>}

          {/* Form for adding/editing rooms */}
          <form onSubmit={handleSubmit}>
            <h2>{editingRoomId ? 'Edit Room' : 'Booked Room Information'}</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              required
            />
            <input
              type="number"
              value={roomPrice}
              onChange={(e) => setRoomPrice(e.target.value)}
              placeholder="Room Price"
              required
            />
            <select
              value={roomStatus}
              onChange={(e) => setRoomStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
            <button type="submit">{editingRoomId ? 'Update Room' : 'Submit'}</button>
          </form>

          {/* Display booked rooms */}
          {rooms.length > 0 && (
            <div className="room-list">
              <h2>Booked Rooms</h2>
              <ul>
                {rooms
                  .filter(room => room.status === 'booked') // Filter booked rooms
                  .map((room) => (
                    <li key={room.id}>
                      <h3>{room.name}</h3>
                      <p>Price: {room.price}</p>
                      <p>Status: {room.status}</p>
                      <button onClick={() => handleEdit(room)}>Edit</button>
                      <button onClick={() => handleDelete(room.id)}>Delete</button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
