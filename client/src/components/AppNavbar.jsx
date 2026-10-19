import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  // Is the current user an admin?
  const isAdmin = user?.role === "admin";

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/dashboard"}
          style={styles.logoContainer}
        >
          <div style={styles.logoIcon}>🏛️</div>
          <div>
            <div style={styles.logoTitle}>Huduma Murang'a</div>
            <div style={styles.logoSubtitle}>Citizen Service Requests</div>
          </div>
        </Link>

        {/* Center Links */}
        <div style={styles.centerLinks}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive("/") ? styles.activeLink : {}),
            }}
          >
            County services
          </Link>

          {/* Only show "My requests" to citizens */}
          {!isAdmin && (
            <Link
              to="/dashboard"
              style={{
                ...styles.navLink,
                ...(isActive("/dashboard") ? styles.activeLink : {}),
              }}
            >
              My requests
            </Link>
          )}

          {/* Only show Admin link if the user is an admin */}
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                ...styles.navLink,
                ...(isActive("/admin") ? styles.activeLink : {}),
              }}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div style={styles.rightActions}>
          {/* Only show "New request" to citizens */}
          {!isAdmin && (
            <Link to="/new-request" style={styles.actionBtn}>
              New request
            </Link>
          )}
          <button onClick={handleLogout} style={styles.actionBtn}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid var(--border-color)",
    padding: "1rem 2rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "var(--text-dark)",
    textDecoration: "none",
  },
  logoIcon: {
    backgroundColor: "var(--primary-green)",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
  },
  logoTitle: {
    fontWeight: "700",
    fontSize: "1rem",
    lineHeight: "1.1",
  },
  logoSubtitle: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  centerLinks: {
    display: "flex",
    gap: "2rem",
  },
  navLink: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    fontWeight: "500",
    textDecoration: "none",
  },
  activeLink: {
    color: "var(--primary-green)",
    fontWeight: "700",
  },
  rightActions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },

  // Unified button style for both "New request" and "Sign out"
  actionBtn: {
    backgroundColor: "var(--primary-green)",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    display: "inline-block",
    lineHeight: "1.4",
  },
};

export default AppNavbar;
