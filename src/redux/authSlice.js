import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    login(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser, clearCurrentUser, setError, login } = authSlice.actions;

export default authSlice.reducer;
