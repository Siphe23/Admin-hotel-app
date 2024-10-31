import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice'; // Adjust the path as necessary

const store = configureStore({
  reducer: {
    hotel: hotelReducer,
  
  },
});

export default store;
