import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import api from '../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await api.get('/requests/my-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  // Calculate stats
  const openCount = requests.filter(r => r.status === 'Pending' || r.status === 'In Progress').length;
  const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

  // Helper for status badge styling
  const getStatusStyle = (status) => {
    if (status === 'Pending') return { backgroundColor: '#fef3c7', color: '#d97706' }; // Amber
    if (status === 'In Progress') return { backgroundColor: '#dbeafe', color: '#2563eb' }; // Blue
    if (status === 'Resolved') return { backgroundColor: '#d1fae5', color: '#059669' }; // Green
    return {};
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <AppNavbar />
      
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* Header Section */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>My requests</h1>
            <p style={styles.pageSubtitle}>
              {openCount} open · {resolvedCount} resolved
            </p>
          </div>
          <button 
            onClick={() => navigate('/new-request')} 
            style={styles.primaryBtn}
          >
            + New request
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your requests...</p>
        ) : requests.length === 0 ? (
          /* EMPTY STATE - Matches your screenshot */
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No requests yet</h3>
            <p style={styles.emptyText}>Report your first issue to the county.</p>
          </div>
        ) : (
          /* REQUESTS LIST */
          <div style={styles.list}>
            {requests.map((request) => (
              <div 
                key={request._id} 
                style={styles.listItem}
                onClick={() => navigate(`/request/${request._id}`)}
              >
                <div style={styles.listLeft}>
                  <div style={styles.requestMeta}>
                    <span style={styles.requestId}>#{request._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <h3 style={styles.requestTitle}>{request.title}</h3>
                  <p style={styles.requestLocation}>
                    📍 {request.location.subCounty} · {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.listRight}>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(request.status) }}>
                    • {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '0.25rem',
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  primaryBtn: {
    backgroundColor: 'var(--primary-green)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  emptyState: {
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: '#faf9f6',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '1.25rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  listLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  requestMeta: {
    display: 'flex',
    alignItems: 'center',
  },
  requestId: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  requestTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
  },
  requestLocation: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  statusBadge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block',
  }
};

export default MyRequests;