import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import AdminHome from './Pages/AdminHome';
import AdminProfile from './Pages/AdminProfile';
import AdminDashboard from './Pages/AdminDashboard';
import AdminLogin from './Pages/AdminLogin';
import AddRoom from './Pages/AddRoom';
import AdminSignup from './Pages/AdminSignup';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/adminhome" />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminlogin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/admindashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/adminlogin" />} />
        <Route path="/adminprofile" element={isAuthenticated ? <AdminProfile /> : <Navigate to="/adminlogin" />} />
        <Route path="/addroom" element={isAuthenticated ? <AddRoom /> : <Navigate to="/adminlogin" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
