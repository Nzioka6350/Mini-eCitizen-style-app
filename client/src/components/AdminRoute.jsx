import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppNavbar from '../components/AppNavbar';
import api from '../services/api';

// Helper for greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('requests');
  const [analytics, setAnalytics] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, open: 0, totalUsers: 0 });
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [subCounties, setSubCounties] = useState([]);        
  const [subCountyName, setSubCountyName] = useState('');    
  const [formData, setFormData] = useState({ category: '', title: '', description: '', fee: '', processingTime: '' });
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const requestsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, requestsRes, servicesRes, subCountiesRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/requests'),
        api.get('/services'),
        api.get('/subcounties') 
      ]);
      setAnalytics(analyticsRes.data);
      setRequests(requestsRes.data);
      setServices(servicesRes.data);
      setSubCounties(subCountiesRes.data); 
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

  // Reset to page 1 whenever the filter changes or requests update
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, requests]);

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

  const getStatusColor = (status) => {
    if (status === 'Pending') return { backgroundColor: '#fef3c7', color: '#d97706' };
    if (status === 'In Progress') return { backgroundColor: '#dbeafe', color: '#2563eb' };
    if (status === 'Resolved') return { backgroundColor: '#d1fae5', color: '#059669' };
    return {};
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'All') return true;
    return req.status === statusFilter;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  // ---------------------------------

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <AppNavbar />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* GREETING SECTION */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here's what's happening with citizen requests today.
          </p>
        </div>

        {/* STATS GRID */}
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
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Users</span>
            <span style={{ ...styles.statValue, color: '#2563eb' }}>{analytics.totalUsers}</span>
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
          <>
            {/* FILTER BUTTONS */}
            <div style={styles.filterContainer}>
              <span style={styles.filterLabel}>Filter by Status:</span>
              {['All', 'Pending', 'In Progress', 'Resolved'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  style={statusFilter === filter ? styles.filterBtnActive : styles.filterBtn}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    {/* NEW # COLUMN */}
                    <th style={{ ...styles.th, width: '50px' }}>#</th>
                    <th style={styles.th}>Citizen</th>
                    <th style={styles.th}>Issue Details</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      {/* CHANGED COLSPAN TO 6 */}
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No requests found matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    currentRequests.map((req, index) => (
                      <tr key={req._id} style={styles.tr}>
                        {/* NEW ROW NUMBER */}
                        <td style={styles.td}>{indexOfFirstRequest + index + 1}</td>
                        
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
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select 
                              value={req.status} 
                              onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                              style={styles.statusSelect}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                            
                            <button 
                              onClick={() => navigate(`/request/${req._id}`)}
                              style={styles.viewBtn}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {filteredRequests.length > 0 && (
              <div style={styles.paginationContainer}>
                <span style={styles.pageInfo}>
                  Showing {indexOfFirstRequest + 1}-{Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} requests
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    style={currentPage === totalPages || totalPages === 0 ? styles.pageBtnDisabled : styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'services' ? (
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
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
  viewBtn: { backgroundColor: '#e8f3ec', color: 'var(--primary-green)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' },
  formCard: { flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' },
  serviceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' },

  // PAGINATION STYLES
  paginationContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' },
  pageInfo: { fontSize: '0.85rem', color: 'var(--text-muted)' },
  pageBtn: { backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' },
  pageBtnDisabled: { backgroundColor: '#e5e7eb', color: '#9ca3af', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'not-allowed', fontWeight: '600', fontSize: '0.85rem' },

  // FILTER STYLES
  filterContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  filterLabel: { fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginRight: '0.5rem' },
  filterBtn: { backgroundColor: '#fff', color: 'var(--text-dark)', border: '1px solid var(--border-color)', padding: '0.35rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
  filterBtnActive: { backgroundColor: 'var(--primary-green)', color: 'white', border: '1px solid var(--primary-green)', padding: '0.35rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }
};

export default AdminDashboard;