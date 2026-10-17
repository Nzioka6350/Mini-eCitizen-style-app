import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PLACEHOLDER DATA - Later this will be fetched from the backend via Admin
const placeholderServices = [
  { category: 'Lands, Housing & Physical Planning', title: 'Building Plan Approval', description: 'Approval of architectural and structural plans before construction.', fee: 'KES 10,000', time: '~30 days' },
  { category: 'Education & Youth', title: 'County Bursary Application', description: 'Financial support for needy students in secondary and tertiary institutions.', fee: 'Free', time: '~30 days' },
  { category: 'Disaster Management', title: 'Fire Safety Certificate', description: 'Inspection and certification of premises for fire safety compliance.', fee: 'KES 2,500', time: '~10 days' },
  { category: 'Health Services', title: 'Food Hygiene Licence', description: 'Licence for premises that handle, prepare or sell food.', fee: 'KES 1,500', time: '~7 days' },
  { category: 'Finance & Revenue', title: 'Land Rates Clearance Certificate', description: 'Certificate confirming land rates are fully paid, needed for transfers.', fee: 'KES 1,000', time: '~5 days' },
  { category: 'Trade & Industrialization', title: 'Liquor Licence', description: 'Licence to sell alcoholic drinks, issued under the county liquor act.', fee: 'KES 15,000', time: '~21 days' },
];

const subCounties = ['Kiharu', 'Kangema', 'Mathioya', 'Kigumo', 'Kandara', 'Gatanga', 'Maragwa', "Murang'a South (Kambiti)"];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleApply = (service) => {
    if (!user) {
      // If not logged in, send to login/register
      navigate('/login');
    } else {
      // If logged in, go to the new request form, passing the service details
      navigate('/new-request', { state: { category: service.category, title: service.title } });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      
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
              <button onClick={() => navigate('/dashboard')} style={styles.primaryBtn}>
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
        {/* Overlay for text readability */}
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>Huduma bora, mahali popote</span>
          <h1 style={styles.heroTitle}>County services,<br/>without the queue.</h1>
          <p style={styles.heroSubtitle}>
            Apply for permits, licences and certificates from Murang'a County. Pay online and follow every step.
          </p>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="🔍 Search e.g. business permit" style={styles.searchInput} />
          </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Available services</h2>
          <span style={styles.serviceCount}>10 services</span>
        </div>

        <div style={styles.grid}>
          {placeholderServices.map((service, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardCategory}>{service.category}</div>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDescription}>{service.description}</p>
              
              <div style={styles.cardFooter}>
                <div style={styles.cardMeta}>
                  <span style={styles.fee}>{service.fee}</span>
                  <span style={styles.time}>🕒 {service.time}</span>
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

        {/* SUB-COUNTIES */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={styles.sectionTitle}>Sub-counties served</h3>
          <div style={styles.subCountyList}>
            {subCounties.map((county, index) => (
              <span key={index} style={styles.subCountyPill}>{county}</span>
            ))}
          </div>
        </div>
      </main>
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
  
  hero: { 
    position: 'relative', 
    height: '450px', 
    backgroundColor: '#2a4f3a',
    // Using a placeholder image for the tea plantation. You can replace this with a local image later.
    backgroundImage: 'url("https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2070&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
  },
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