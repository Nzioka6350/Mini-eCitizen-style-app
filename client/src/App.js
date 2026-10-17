import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import MyRequests from './pages/MyRequests';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No Navbar should wrap these unless explicit */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Citizen Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MyRequests />} /> 
            <Route path="/new-request" element={<div style={{ padding: '2rem' }}>Request form coming next!</div>} /> 
            <Route path="/request/:id" element={<div style={{ padding: '2rem' }}>Request details coming next!</div>} /> 
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;