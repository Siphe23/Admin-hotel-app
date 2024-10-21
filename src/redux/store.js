// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice'; // Adjust the import as necessary

const store = configureStore({
    reducer: {
        hotel: hotelReducer,
        
    },
});

export default store;
