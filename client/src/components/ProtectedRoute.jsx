import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is an admin, only allow them to view request details.
  // If they try to access any other citizen route (like /dashboard or /new-request),
  // redirect them back to /admin.
  if (user.role === "admin" && !location.pathname.startsWith("/request/")) {
    return <Navigate to="/admin" replace />;
  }

  // Allow citizens (and admins viewing request details) through
  return <Outlet />;
};

export default ProtectedRoute;
