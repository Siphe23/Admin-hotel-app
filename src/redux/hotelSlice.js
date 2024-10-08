import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../Firebase/firebase'; // Ensure this path is correct
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Thunks for fetching, adding, deleting, and updating rooms
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
    const querySnapshot = await getDocs(collection(db, 'rooms'));
    const rooms = [];
    querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
    });
    return rooms;
});

export const addRoom = createAsyncThunk('rooms/addRoom', async (room) => {
    const docRef = await addDoc(collection(db, 'rooms'), room);
    return { id: docRef.id, ...room };
});

export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id) => {
    await deleteDoc(doc(db, 'rooms', id));
    return id; // Return the id of the deleted room
});

export const updateRoom = createAsyncThunk('rooms/updateRoom', async ({ id, room }) => {
    const roomRef = doc(db, 'rooms', id);
    await updateDoc(roomRef, room);
    return { id, ...room }; // Return the updated room data
});

// Create the slice
const hotelSlice = createSlice({
    name: 'hotel',
    initialState: {
        rooms: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Add the setRooms reducer
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room.id !== action.payload);
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(room => room.id === action.payload.id);
                if (index !== -1) {
                    state.rooms[index] = action.payload;
                }
            });
    },
});

// Export the reducer and actions
export const { setRooms } = hotelSlice.actions;
export default hotelSlice.reducer;
