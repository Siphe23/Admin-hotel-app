import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservationsFromFirestore } from '../redux/hotelSlice'; // Action to fetch reservations
import { getAuth } from 'firebase/auth';

function AdminProfile() {
    const dispatch = useDispatch();
    const auth = getAuth();
    const reservations = useSelector((state) => state.hotel.reservations);

    useEffect(() => {
        dispatch(fetchReservationsFromFirestore()); // Load reservations
    }, [dispatch]);

    return (
     
        <div>
            <h2>Your Profile</h2>
            {/* Display reservations or profile details */}
            {reservations.length > 0 ? (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            {reservation.details}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reservations found.</p>
            )}
        </div>
        
    );
}

export default AdminProfile;
