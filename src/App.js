import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from './Pages/AdminHome';
import AdminProfile from './Pages/AdminProfile';
import AdminDashboard from './Pages/AdminDashboard';
import AdminLogin from './Pages/AdminLogin';
import AdminSignup from './Pages/AdminSignup';
import { RatingsProvider } from './context/RatingsContext';

const App = () => {
  return (
    <Router>
      <RatingsProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/adminlogin" />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminsignup" element={<AdminSignup />} />
        </Routes>
      </RatingsProvider>
    </Router>
  );
};

export default App;
