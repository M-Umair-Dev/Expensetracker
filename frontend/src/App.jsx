import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin'

function App() {
  // Grab the real user data from local storage if it exists
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user; // true if user exists, false if null

  const loginUser = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Pass the actual user name to the Navbar if you want! */}
        <Navbar isAuthenticated={isAuthenticated} logoutUser={logoutUser} />
        
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={loginUser} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Signup onSignup={loginUser} /> : <Navigate to="/dashboard" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
               <Route path="/admin" element={<Admin />} />

        </Routes>
   
      </div>
    </Router>
  );
}

export default App;