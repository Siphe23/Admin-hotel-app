// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from './Pages/AdminHome';
import AdminProfile from './Pages/AdminProfile';
import AdminDashboard from './Pages/AdminDashboard';
import AdminLogin from './Pages/AdminLogin';
import AdminSignup from './Pages/AdminSignup';
import NotFound from './Pages/NotFound';
import ProtectedRoute from './Actions/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/adminhome" />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
