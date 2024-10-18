import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../Firebase/firebase'; // Adjust the import as necessary
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Thunk for adding a room
export const addRoom = createAsyncThunk('hotels/addRoom', async (roomData) => {
    try {
        const docRef = await addDoc(collection(db, 'rooms'), roomData);
        return { id: docRef.id, ...roomData };
    } catch (error) {
        console.error('Error adding room: ', error);
        throw error;
    }
});

// Thunk for fetching rooms
export const fetchRooms = createAsyncThunk('hotels/fetchRooms', async () => {
    const roomCollection = collection(db, 'rooms');
    const roomSnapshot = await getDocs(roomCollection);
    const roomList = roomSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return roomList;
});

// Thunk for updating a room
export const updateRoom = createAsyncThunk('hotels/updateRoom', async ({ id, roomData }) => {
    const roomRef = doc(db, 'rooms', id);
    await updateDoc(roomRef, roomData);
    return { id, ...roomData };
});

// Thunk for deleting a room
export const deleteRoom = createAsyncThunk('hotels/deleteRoom', async (id) => {
    const roomRef = doc(db, 'rooms', id);
    await deleteDoc(roomRef);
    return id;
});

// Hotel slice
const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        rooms: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(room => room.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload;
                }
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(addRoom.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

// Export the actions


export default hotelSlice.reducer;
