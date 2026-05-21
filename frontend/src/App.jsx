import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Visits from './pages/Visits';
import Reports from './pages/Reports';
import Regions from './pages/Regions';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import MyTeam from './pages/MyTeam';
import Sidebar from './components/Sidebar';
import { jwtDecode } from 'jwt-decode';

import { ThemeProvider } from './components/ThemeContext';
import { CacheProvider } from './components/CacheContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    // Force reload to completely wipe React state cache
    window.location.href = '/';
  };

  return (
    <ThemeProvider>
      <CacheProvider>
        <Router>
          <div className="layout">
            {user && <Sidebar onLogout={handleLogout} user={user} />}
          <main className={user ? "main-content" : "landing-main"}>
            <Routes>
              <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
              <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
              
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/tasks" element={user ? <TaskList user={user} /> : <Navigate to="/login" />} />
              <Route path="/tasks/:id" element={user ? <TaskDetail /> : <Navigate to="/login" />} />
              <Route path="/logs" element={user ? <Logs /> : <Navigate to="/login" />} />
              <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
              <Route path="/visits" element={user ? <Visits /> : <Navigate to="/login" />} />
              <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
              <Route path="/regions" element={user ? <Regions /> : <Navigate to="/login" />} />
              <Route path="/teams" element={user ? <Teams /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/my-team" element={user ? <MyTeam /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;
