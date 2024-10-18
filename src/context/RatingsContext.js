import React, { createContext, useContext, useState } from 'react';

// Create the Ratings Context
const RatingsContext = createContext();

// Create a custom hook for using the Ratings Context
export const useRatings = () => {
  const context = useContext(RatingsContext);
  
  // Throw an error if useRatings is used outside the RatingsProvider
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  
  return context;
};

// RatingsProvider component that provides the context value
export const RatingsProvider = ({ children }) => {
  const [userRatings, setUserRatings] = useState({}); // Initialize as an object for ratings

  const updateRating = (offerId, rating) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [offerId]: rating,
    }));
  };

  const value = {
    userRatings,
    updateRating // Provide the updateRating function to the context
  };

  return (
    <RatingsContext.Provider value={value}>
      {children}
    </RatingsContext.Provider>
  );
};
