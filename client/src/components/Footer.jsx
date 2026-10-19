import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Column 1: Branding */}
        <div style={styles.column}>
          <div style={styles.brand}>
            <div>
              <div style={styles.brandTitle}>Murang'a e-Huduma</div>
              <div style={styles.brandSubtitle}>
                County Government of Murang'a
              </div>
            </div>
          </div>
          <p style={styles.tagline}>
            Huduma bora, mahali popote. Access county services online — apply,
            pay, and track from anywhere.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.list}>
            <li>
              <Link to="/" style={styles.link}>
                County Services
              </Link>
            </li>
            <li>
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" style={styles.link}>
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Popular Services</h4>
          <ul style={styles.list}>
            <li>
              <span style={styles.link}>Business Permits</span>
            </li>
            <li>
              <span style={styles.link}>Land Rates</span>
            </li>
            <li>
              <span style={styles.link}>Bursary Applications</span>
            </li>
            <li>
              <span style={styles.link}>Health Complaints</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Contact Us</h4>
          <ul style={styles.list}>
            <li style={styles.contactItem}>Murang'a Town, Kenya</li>
            <li style={styles.contactItem}>+254 742425868</li>
            <li style={styles.contactItem}>info@muranga.go.ke</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomContainer}>
          <p style={styles.copyright}>
            © {currentYear} County Government of Murang'a. All rights reserved.
          </p>
          <div style={styles.legalLinks}>
            <span style={styles.legalLink}>Privacy Policy</span>
            <span style={styles.legalLink}>Terms of Service</span>
            <span style={styles.legalLink}>Designed by James Nzioka Mutua</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#14372a",
    color: "#d1d5db",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "2rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    marginBottom: "1rem",
  },
  brandTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "1.05rem",
  },
  brandSubtitle: {
    color: "#9ca3af",
    fontSize: "0.75rem",
  },
  tagline: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    lineHeight: "1.6",
    marginTop: "0.5rem",
  },
  heading: {
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  link: {
    color: "#d1d5db",
    fontSize: "0.85rem",
    textDecoration: "none",
    cursor: "pointer",
  },
  contactItem: {
    fontSize: "0.85rem",
    color: "#d1d5db",
  },
  bottomBar: {
    borderTop: "1px solid #1f4d3a",
    padding: "1rem 2rem",
  },
  bottomContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copyright: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  legalLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  legalLink: {
    fontSize: "0.8rem",
    color: "#9ca3af",
    cursor: "pointer",
  },
};

export default Footer;
