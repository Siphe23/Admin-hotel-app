// BookedRooms.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookedRoomsFromFirestore } from '../redux/hotelSlice';


function BookedRooms() {
    const dispatch = useDispatch();
    const bookedRooms = useSelector((state) => state.hotel.bookedRooms);

    useEffect(() => {
        dispatch(fetchBookedRoomsFromFirestore());
    }, [dispatch]);

    return (
        <>
  
        <div>
            <h2>Booked Rooms</h2>
            <table className="booked-rooms-table">
                <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Guest Name</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookedRooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.roomName}</td>
                            <td>{room.guestName}</td>
                            <td>{room.checkIn}</td>
                            <td>{room.checkOut}</td>
                            <td>{room.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    
        </>
    );
}

export default BookedRooms;
