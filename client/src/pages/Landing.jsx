import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, subCountiesRes] = await Promise.all([
          api.get('/services'),
          api.get('/subcounties'),
        ]);
        setServices(servicesRes.data);
        setSubCounties(subCountiesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = (service) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/new-request', {
        state: {
          serviceId: service._id,
          category: service.category,
          title: service.title
        }
      });
    }
  };

  return (
    // <-- Wrapper with flex column so Footer sits at bottom
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* 1. PUBLIC NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>🏛️</div>
            <div>
              <div style={styles.logoTitle}>Murang'a e-Huduma</div>
              <div style={styles.logoSubtitle}>County Government of Murang'a</div>
            </div>
          </div>
          <div style={styles.rightActions}>
            {user ? (
              <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')} style={styles.primaryBtn}>
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={styles.textBtn}>Services</button>
                <button onClick={() => navigate('/login')} style={styles.primaryBtn}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>Huduma bora, mahali popote</span>
          <h1 style={styles.heroTitle}>County services,<br />without the queue.</h1>
          <p style={styles.heroSubtitle}>
            Apply for permits, licences and certificates from Murang'a County. Pay online and follow every step.
          </p>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="🔍 Search e.g. business permit" style={styles.searchInput} />
          </div>
        </div>
      </div>

      {/* 3. SERVICES GRID (flex: 1 pushes footer down) */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', flex: 1 }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Available services</h2>
          <span style={styles.serviceCount}>{services.length} services</span>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading services...</p>
        ) : services.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No services available at the moment. Please check back later.</p>
        ) : (
          <div style={styles.grid}>
            {services.map((service) => (
              <div key={service._id} style={styles.card}>
                <div style={styles.cardCategory}>{service.category}</div>
                <h3 style={styles.cardTitle}>{service.title}</h3>
                <p style={styles.cardDescription}>{service.description}</p>

                <div style={styles.cardFooter}>
                  <div style={styles.cardMeta}>
                    <span style={styles.fee}>{service.fee}</span>
                    <span style={styles.time}>🕒 {service.processingTime}</span>
                  </div>
                  <button
                    onClick={() => handleApply(service)}
                    style={styles.applyBtn}
                  >
                    Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUB-COUNTIES (from DB) */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={styles.sectionTitle}>Sub-counties served</h3>
          <div style={styles.subCountyList}>
            {subCounties.map((county) => (
              <span key={county._id} style={styles.subCountyPill}>{county.name}</span>
            ))}
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
};

const styles = {
  nav: { backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem' },
  navContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { backgroundColor: 'var(--primary-green)', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' },
  logoTitle: { fontWeight: '700', fontSize: '1rem' },
  logoSubtitle: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  rightActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  textBtn: { background: 'none', border: 'none', color: 'var(--text-dark)', fontWeight: '500', cursor: 'pointer' },
  primaryBtn: { backgroundColor: 'var(--primary-green)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' },

  hero: { position: 'relative', height: '450px', backgroundColor: '#2a4f3a', backgroundImage: 'url("https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', width: '100%' },
  heroBadge: { backgroundColor: '#f5c14e', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-block', marginBottom: '1rem' },
  heroTitle: { color: 'white', fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem' },
  heroSubtitle: { color: '#e5e7eb', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2rem' },
  searchContainer: { backgroundColor: 'white', borderRadius: '8px', display: 'flex', maxWidth: '500px', padding: '0.2rem' },
  searchInput: { flex: 1, padding: '0.8rem 1rem', border: 'none', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' },

  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: '800' },
  serviceCount: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  cardCategory: { fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' },
  cardDescription: { fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', flexGrow: 1, marginBottom: '1.5rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' },
  cardMeta: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  fee: { fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-dark)' },
  time: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  applyBtn: { background: 'none', border: 'none', color: 'var(--primary-green)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' },

  subCountyList: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' },
  subCountyPill: { backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }
};

export default Landing;