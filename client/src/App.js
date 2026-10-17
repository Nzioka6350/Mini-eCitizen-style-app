import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing'; // Import the new Landing page
import ProtectedRoute from './components/ProtectedRoute';

// Temporary Citizen Dashboard (We will build the real one later)
const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Citizen Dashboard</h1>
      <p>This is where "My requests" will go.</p>
      <button onClick={logout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes (Only accessible if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Temporary placeholder for the form we build next */}
            <Route path="/new-request" element={<div style={{ padding: '2rem' }}>Request form coming next!</div>} /> 
          </Route>

          {/* Catch-all: If user types a random URL, send them to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;