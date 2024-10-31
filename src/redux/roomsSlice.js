import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms(state, action) {
            state.rooms = action.payload;
        },
    },
});

export const { setRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
