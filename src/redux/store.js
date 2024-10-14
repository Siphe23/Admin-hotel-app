import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import hotelReducer from './hotelSlice'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;
