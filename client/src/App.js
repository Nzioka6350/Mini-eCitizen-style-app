import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Login successful! We will build the real dashboard next.</p>
      <button onClick={logout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;