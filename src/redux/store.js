import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Ensure this import is correct
import hotelReducer from './hotelSlice'; // Ensure you have a hotelSlice if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer, // Only include this if hotelReducer is defined
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check if necessary
    }),
});

export default store;
