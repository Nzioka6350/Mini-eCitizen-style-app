import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import MyRequests from './pages/MyRequests';
import AdminDashboard from './pages/AdminDashboard';
import NewRequest from './pages/NewRequest'; 
import RequestDetail from './pages/RequestDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Citizen Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MyRequests />} /> 
            <Route path="/new-request" element={<NewRequest />} /> 
            {/* Request Details accessible to both Citizens and Admins */}
            <Route path="/request/:id" element={<RequestDetail />} /> 
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