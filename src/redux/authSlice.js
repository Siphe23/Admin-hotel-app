import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    userRole: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.role; // Assuming payload includes user role
    },
    // Add more reducers as needed
  },
});

// Export actions
export const { login, setRooms } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
