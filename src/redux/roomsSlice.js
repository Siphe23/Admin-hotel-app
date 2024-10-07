import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [], // Initialize the rooms array or object
  // other properties
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    // Add your reducers here
    setRooms(state, action) {
      state.rooms = action.payload;
    },
    // other reducers
  },
});

export const { setRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
