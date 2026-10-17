import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Left: Logo */}
        <Link to="/dashboard" style={styles.logoContainer}>
          <div style={styles.logoIcon}>🏛️</div>
          <div>
            <div style={styles.logoTitle}>Huduma Murang'a</div>
            <div style={styles.logoSubtitle}>Citizen Service Requests</div>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div style={styles.centerLinks}>
          <Link to="/dashboard" style={styles.navLink}>County services</Link>
          <Link to="/my-requests" style={styles.navLink}>My requests</Link>
          <Link to="/admin" style={styles.navLink}>Admin</Link>
        </div>

        {/* Right: Actions */}
        <div style={styles.rightActions}>
          <Link to="/new-request" style={styles.newRequestBtn}>New request</Link>
          <button onClick={handleLogout} style={styles.signOutBtn}>Sign out</button>
        </div>
      </div>
    </nav>
  );
};

// Inline styles for simplicity - we can move these to CSS later
const styles = {
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-color)',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-dark)',
  },
  logoIcon: {
    backgroundColor: 'var(--primary-green)',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
  },
  logoTitle: {
    fontWeight: '700',
    fontSize: '1rem',
    lineHeight: '1.1',
  },
  logoSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  centerLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: 'var(--text-dark)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  rightActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  newRequestBtn: {
    backgroundColor: 'var(--primary-green)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  signOutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-dark)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
  }
};

export default Navbar;