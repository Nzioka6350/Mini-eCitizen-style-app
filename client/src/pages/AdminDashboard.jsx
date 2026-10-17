import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppNavbar from '../components/AppNavbar';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('requests');
  const [analytics, setAnalytics] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, open: 0 });
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [subCounties, setSubCounties] = useState([]);        // <-- NEW
  const [subCountyName, setSubCountyName] = useState('');    // <-- NEW
  const [formData, setFormData] = useState({ category: '', title: '', description: '', fee: '', processingTime: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, requestsRes, servicesRes, subCountiesRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/requests'),
        api.get('/services'),
        api.get('/subcounties') // <-- NEW
      ]);
      setAnalytics(analyticsRes.data);
      setRequests(requestsRes.data);
      setServices(servicesRes.data);
      setSubCounties(subCountiesRes.data); // <-- NEW
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', formData);
      setFormData({ category: '', title: '', description: '', fee: '', processingTime: '' });
      fetchData();
      alert('Service added successfully!');
    } catch (error) {
      alert('Failed to add service');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Deactivate this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete service');
      }
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await api.patch(`/admin/requests/${requestId}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  // ---- Sub-county handlers ----
  const handleAddSubCounty = async (e) => {
    e.preventDefault();
    if (!subCountyName.trim()) return;
    try {
      await api.post('/subcounties', { name: subCountyName.trim() });
      setSubCountyName('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add sub-county');
    }
  };

  const handleDeleteSubCounty = async (id) => {
    if (window.confirm('Remove this sub-county?')) {
      try {
        await api.delete(`/subcounties/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };
  // -----------------------------

  const getStatusColor = (status) => {
    if (status === 'Pending') return { backgroundColor: '#fef3c7', color: '#d97706' };
    if (status === 'In Progress') return { backgroundColor: '#dbeafe', color: '#2563eb' };
    if (status === 'Resolved') return { backgroundColor: '#d1fae5', color: '#059669' };
    return {};
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <AppNavbar />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>Admin Overview</h1>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Requests</span>
            <span style={styles.statValue}>{analytics.total}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Open (Pending + In Progress)</span>
            <span style={{ ...styles.statValue, color: '#d97706' }}>{analytics.open}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Resolved Cases</span>
            <span style={{ ...styles.statValue, color: '#059669' }}>{analytics.resolved}</span>
          </div>
        </div>

        <div style={styles.tabsContainer}>
          <button onClick={() => setActiveTab('requests')} style={activeTab === 'requests' ? styles.activeTab : styles.inactiveTab}>
            Citizen Requests
          </button>
          <button onClick={() => setActiveTab('services')} style={activeTab === 'services' ? styles.activeTab : styles.inactiveTab}>
            Manage Services
          </button>
          <button onClick={() => setActiveTab('subcounties')} style={activeTab === 'subcounties' ? styles.activeTab : styles.inactiveTab}>
            Sub-counties
          </button>
        </div>

        {loading ? (
          <p>Loading panel...</p>

        ) : activeTab === 'requests' ? (
          /* =============== REQUESTS TAB =============== */
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Citizen</th>
                  <th style={styles.th}>Issue Details</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No requests have been made yet.
                    </td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600' }}>{req.userId?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.userId?.email}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600' }}>{req.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.category}</div>
                      </td>
                      <td style={styles.td}>
                        <div>{req.location.subCounty}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.location.landmark}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, ...getStatusColor(req.status) }}>
                          {req.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <select 
                          value={req.status} 
                          onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        ) : activeTab === 'services' ? (
          /* =============== SERVICES TAB =============== */
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={styles.formCard}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Service</h3>
              <form onSubmit={handleServiceSubmit}>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Service Title</label>
                  <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Fee</label>
                    <input type="text" className="form-control" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} placeholder="Free" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Processing Time</label>
                    <input type="text" className="form-control" value={formData.processingTime} onChange={e => setFormData({...formData, processingTime: e.target.value})} placeholder="e.g. ~5 days" />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Service</button>
              </form>
            </div>

            <div style={{ flex: 2, minWidth: '300px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Existing Services</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {services.map(service => (
                  <div key={service._id} style={styles.serviceItem}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{service.category}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{service.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{service.fee} • {service.processingTime}</div>
                    </div>
                    <button onClick={() => handleDeleteService(service._id)} style={styles.deleteBtn}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : (
          /* =============== SUB-COUNTIES TAB =============== */
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={styles.formCard}>
              <h3 style={{ marginBottom: '1rem' }}>Add Sub-county</h3>
              <form onSubmit={handleAddSubCounty}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={subCountyName}
                    onChange={(e) => setSubCountyName(e.target.value)}
                    placeholder="e.g. Kiharu"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Add Sub-county</button>
              </form>
            </div>

            <div style={{ flex: 2, minWidth: '300px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Existing Sub-counties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {subCounties.map((sc) => (
                  <div key={sc._id} style={styles.serviceItem}>
                    <div style={{ fontWeight: '600' }}>{sc.name}</div>
                    <button onClick={() => handleDeleteSubCounty(sc._id)} style={styles.deleteBtn}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
  statCard: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  statLabel: { fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' },
  statValue: { fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)' },
  tabsContainer: { display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' },
  activeTab: { padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: '2px solid var(--primary-green)', color: 'var(--primary-green)', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' },
  inactiveTab: { padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-muted)', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' },
  tr: { borderBottom: '1px solid var(--border-color)' },
  td: { padding: '1rem', fontSize: '0.9rem', verticalAlign: 'middle' },
  statusBadge: { padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-block' },
  statusSelect: { padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' },
  formCard: { flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' },
  serviceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }
};

export default AdminDashboard;