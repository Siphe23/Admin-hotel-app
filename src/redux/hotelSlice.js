import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../Firebase/firebase'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Thunk to fetch rooms from Firestore
export const fetchRoomsFromFirestore = createAsyncThunk(
  'rooms/fetchRooms',
  async () => {
    const roomsCol = collection(db, 'rooms'); 
    const roomSnapshot = await getDocs(roomsCol);
    const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return roomList;
  }
);

// Thunk to add a room to Firestore
export const addRoomToFirestore = createAsyncThunk(
  'rooms/addRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const roomsCol = collection(db, 'rooms');
      const docRef = await addDoc(roomsCol, roomData);
      return { id: docRef.id, ...roomData };
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors properly
    }
  }
);

// Create the hotel slice
const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    rooms: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsFromFirestore.fulfilled, (state, action) => {
        state.rooms = action.payload;
      })
      .addCase(addRoomToFirestore.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(addRoomToFirestore.rejected, (state, action) => {
        state.error = action.payload; // Handle errors
      });
  },
});

// Export the async thunks once
export default hotelSlice.reducer;

