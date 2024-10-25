import { createSlice } from '@reduxjs/toolkit';

const hotelSlice = createSlice({
    name: 'hotel',
    initialState: {
        rooms: [],
    },
    reducers: {
        addRoomToFirestore: (state, action) => {
            state.rooms.push(action.payload);
        },
        // Add this reducer for updating a room
        updateRoomInFirestore: (state, action) => {
            const index = state.rooms.findIndex(room => room.id === action.payload.id);
            if (index !== -1) {
                state.rooms[index] = action.payload; // Update the room details
            }
        },
        fetchRoomsFromFirestore: (state, action) => {
            state.rooms = action.payload;
        },
    },
});

export const { addRoomToFirestore, updateRoomInFirestore, fetchRoomsFromFirestore } = hotelSlice.actions;

export default hotelSlice.reducer;
