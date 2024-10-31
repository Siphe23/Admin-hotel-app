// hotelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../Firebase/firebase'; 
import { collection, addDoc, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

// Existing fetchRoomsFromFirestore
export const fetchRoomsFromFirestore = createAsyncThunk('hotel/fetchRooms', async () => {
    const roomsCollection = collection(db, 'rooms');
    const roomsSnapshot = await getDocs(roomsCollection);
    const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return roomsList;
});

// New thunk to fetch booked hotels
export const fetchBookedHotelsFromFirestore = createAsyncThunk('hotel/fetchBookedHotels', async () => {
    const bookedHotelsCollection = collection(db, 'bookedHotels'); // Adjust this path based on your Firestore structure
    const bookedHotelsSnapshot = await getDocs(bookedHotelsCollection);
    const bookedHotelsList = bookedHotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return bookedHotelsList;
});

// New thunk to fetch reservations
export const fetchReservationsFromFirestore = createAsyncThunk('hotel/fetchReservations', async () => {
    const reservationsCollection = collection(db, 'reservations'); // Adjust this path based on your Firestore structure
    const reservationsSnapshot = await getDocs(reservationsCollection);
    const reservationsList = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reservationsList;
});

// Async thunk to add a room
export const addRoomToFirestore = createAsyncThunk('hotel/addRoom', async (roomData) => {
    const roomsCollection = collection(db, 'rooms');
    const docRef = await addDoc(roomsCollection, roomData);
    return { id: docRef.id, ...roomData };
});

// Async thunk to update a room
export const updateRoomInFirestore = createAsyncThunk('hotel/updateRoom', async ({ id, roomData }) => {
    const roomRef = doc(db, 'rooms', id);
    await setDoc(roomRef, roomData);
    return { id, ...roomData };
});

// Async thunk to delete a room
export const deleteRoomFromFirestore = createAsyncThunk('hotel/deleteRoom', async (id) => {
    const roomRef = doc(db, 'rooms', id);
    await deleteDoc(roomRef);
    return id; // Return the id to remove it from state
});

// Create slice
const hotelSlice = createSlice({
    name: 'hotel',
    initialState: {
        rooms: [],
        bookedHotels: [],
        reservations: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomsFromFirestore.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })
            .addCase(fetchBookedHotelsFromFirestore.fulfilled, (state, action) => {
                state.bookedHotels = action.payload;
            })
            .addCase(fetchReservationsFromFirestore.fulfilled, (state, action) => {
                state.reservations = action.payload;
            })
            .addCase(addRoomToFirestore.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
            })
            .addCase(updateRoomInFirestore.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(room => room.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload;
                }
            })
            .addCase(deleteRoomFromFirestore.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
            });
    },
});

// Default export
export default hotelSlice.reducer;
