import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import api from '../services/api';

const NewRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};

  const [formData, setFormData] = useState({
    serviceId: prefill.serviceId || '',
    title: prefill.title || '',
    category: prefill.category || '',
    subCounty: '',
    landmark: '',
    description: ''
  });

  const [services, setServices] = useState([]);
  const [subCounties, setSubCounties] = useState([]); // <-- ADDED
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both in parallel
        const [servicesRes, subCountiesRes] = await Promise.all([
          api.get('/services'),
          api.get('/subcounties'),
        ]);
        setServices(servicesRes.data);
        setSubCounties(subCountiesRes.data); // <-- STORE
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (e) => {
    const selectedId = e.target.value;
    const selected = services.find(s => s._id === selectedId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        serviceId: selected._id,
        title: selected.title,
        category: selected.category
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.serviceId) {
      setError('Please select a service');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/requests', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <AppNavbar />
      
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={styles.formCard}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Submit a request</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Tell the county what needs attention.</p>
          </div>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '6px', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Category</label>
              <select name="serviceId" className="form-control" value={formData.serviceId} onChange={handleServiceSelect} required>
                <option value="">-- Select a service --</option>
                {services.map(s => (
                  <option key={s._id} value={s._id}>{s.category} - {s.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Sub-county</label>
                <select name="subCounty" className="form-control" value={formData.subCounty} onChange={handleChange} required>
                  <option value="">Select sub-county</option>
                  {subCounties.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Location / Landmark</label>
                <input type="text" name="landmark" className="form-control" placeholder="e.g. Near Mukuyu market" value={formData.landmark} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-control" rows="5" placeholder="What is the problem and since when?" value={formData.description} onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label>Photo (optional)</label>
              <div style={styles.uploadBox}>📷 Click to attach an image (max 5MB)</div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
              {isLoading ? 'Submitting...' : 'Submit request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
  uploadBox: { border: '1px dashed var(--border-color)', padding: '1rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }
};

export default NewRequest;