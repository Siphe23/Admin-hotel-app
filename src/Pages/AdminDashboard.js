import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookedHotelsFromFirestore } from '../redux/hotelSlice';
import '../assets/dashboard.css'; // Include any necessary CSS for styling

function AdminDashboard() {
    const dispatch = useDispatch();
    const { bookedHotels, loading, error } = useSelector((state) => state.hotel);

    useEffect(() => {
        dispatch(fetchBookedHotelsFromFirestore());
    }, [dispatch]);

    return (
  
        <div className="admin-dashboard">
         
            <div className="dashboard-content"> {/* Container for the dashboard content */}
                <h2>Booked Hotels</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {bookedHotels.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Hotel Name</th>
                                <th>User Name</th>
                                <th>Rating</th>
                                <th>Check-in Date</th>
                                <th>Check-out Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookedHotels.map((hotel) => (
                                <tr key={hotel.id}>
                                    <td>{hotel.hotelName}</td>
                                    <td>{hotel.userName}</td>
                                    <td>{hotel.rating}</td>
                                    <td>{hotel.checkInDate}</td>
                                    <td>{hotel.checkOutDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No booked hotels found.</p>
                )}
            </div>
        </div>
       
    );
}

export default AdminDashboard;
