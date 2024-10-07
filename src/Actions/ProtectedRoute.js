import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const currentUser = useSelector((state) => state.auth.currentUser);

    // If no current user is found, navigate to login
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // If user is authenticated, return the protected children
    return children;
};

export default ProtectedRoute;
