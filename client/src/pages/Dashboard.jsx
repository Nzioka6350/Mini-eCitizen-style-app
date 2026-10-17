import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    category: 'Trade & Cooperatives',
    title: 'Market stall & trader issue',
    description: 'Issues at Murang\'a, Kenol, Kangari or Maragua markets — stalls, cleanliness, security.',
  },
  {
    category: 'Finance & Revenue',
    title: 'Single business permit enquiry',
    description: 'Help with applying for or renewing a county business permit.',
  },
  {
    category: 'Education & Technical Training',
    title: 'Ward bursary application',
    description: 'Ward-level bursary support for secondary, college and university students.',
  },
  {
    category: 'Lands & Physical Planning',
    title: 'Land rates & physical planning',
    description: 'Land rates statements, building approvals and boundary disputes.',
  },
  {
    category: 'Trade & Cooperatives',
    title: 'Cooperative society support',
    description: 'Support for dairy, coffee and SACCO cooperatives across the county.',
  },
  {
    category: 'Agriculture, Livestock & Irrigation',
    title: 'Tea, coffee & avocado extension',
    description: 'Request a visit from a county agricultural extension officer for farm advice, pests or seedlings.',
  },
  {
    category: 'Water & Irrigation',
    title: 'Murang\'a Water (MUWASCO) connection',
    description: 'Report bursts, request new connections or raise billing issues with the county water company.',
  },
  {
    category: 'Health Services',
    title: 'Health facility complaint',
    description: 'Raise service issues at Murang\'a Level 5 Hospital, sub-county hospitals or dispensaries.',
  },
];

const publicWorks = [
  'Broken streetlight',
  'Water supply issue',
  'Garbage collection',
  'Road / pothole repair',
  'Blocked drainage / sewer'
];

const subCounties = [
  'Kiharu', 'Kangema', 'Mathioya', 'Kigumo', 'Kandara', 'Gatanga', 'Maragwa', 'Murang\'a South (Kambiti)'
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Services Grid */}
        <div style={styles.grid}>
          {services.map((service, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardCategory}>
                <span style={styles.categoryIcon}>🏢</span> {service.category}
              </div>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDescription}>{service.description}</p>
              <button 
                onClick={() => navigate('/new-request', { state: { category: service.category, title: service.title } })}
                style={styles.requestBtn}
              >
                Request this
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section: Public Works & Sub-counties */}
        <div style={styles.bottomSection}>
          
          {/* Public Works */}
          <div style={styles.publicWorks}>
            <h3 style={styles.sectionTitle}>Public works</h3>
            <div style={styles.publicWorksList}>
              {publicWorks.map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => navigate('/new-request', { state: { category: 'Public Works', title: item } })}
                  style={styles.publicWorkItem}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-counties Served */}
          <div style={styles.subCounties}>
            <h3 style={styles.sectionTitle}>Sub-counties served</h3>
            <div style={styles.subCountyList}>
              {subCounties.map((county, index) => (
                <span key={index} style={styles.subCountyPill}>
                  {county}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

// Inline styles
const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  cardCategory: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  categoryIcon: {
    fontSize: '0.9rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: 'var(--text-dark)',
  },
  cardDescription: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  requestBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f3ec', /* Light green background */
    color: 'var(--primary-green)',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  bottomSection: {
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
    paddingTop: '2rem',
    borderTop: '1px solid var(--border-color)',
  },
  publicWorks: {
    flex: 1,
    minWidth: '300px',
  },
  subCounties: {
    flex: 1,
    minWidth: '300px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'var(--text-dark)',
  },
  publicWorksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  publicWorkItem: {
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#f3f0e8', /* Slight beige background */
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: 'var(--text-dark)',
    cursor: 'pointer',
    fontWeight: '500',
  },
  subCountyList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  subCountyPill: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: 'var(--text-dark)',
  },
};