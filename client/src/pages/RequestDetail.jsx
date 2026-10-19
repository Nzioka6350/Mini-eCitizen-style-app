import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import api from "../services/api";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await api.get(`/requests/${id}`);
        setRequest(response.data.request);
        setHistory(response.data.history);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load request details",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [id]);

  const getStatusColor = (status) => {
    if (status === "Pending")
      return { backgroundColor: "#fef3c7", color: "#d97706" };
    if (status === "In Progress")
      return { backgroundColor: "#dbeafe", color: "#2563eb" };
    if (status === "Resolved")
      return { backgroundColor: "#d1fae5", color: "#059669" };
    return {};
  };

  if (loading)
    return (
      <div style={{ padding: "2rem" }}>
        <AppNavbar />
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "2rem" }}>
        <AppNavbar />
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!request) return null;

  return (
    <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <AppNavbar />

      <main
        style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary-green)",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          ← Back
        </button>

        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <div style={styles.idText}>
                #{request._id.slice(-6).toUpperCase()}
              </div>
              <h1 style={styles.title}>{request.title}</h1>
            </div>
            <span
              style={{
                ...styles.statusBadge,
                ...getStatusColor(request.status),
              }}
            >
              {request.status}
            </span>
          </div>

          {/* Citizen Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Citizen Information</h3>
            <p>
              <strong>Name:</strong> {request.userId?.name}
            </p>
            <p>
              <strong>Email:</strong> {request.userId?.email}
            </p>
            <p>
              <strong>Phone:</strong> {request.userId?.phone || "N/A"}
            </p>
          </div>

          {/* Location Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Location</h3>
            <p>
              <strong>Sub-county:</strong> {request.location.subCounty}
            </p>
            <p>
              <strong>Landmark:</strong> {request.location.landmark}
            </p>
          </div>

          {/* Description */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <div style={styles.descriptionBox}>{request.description}</div>
          </div>

          {/* Timeline (History) */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Timeline</h3>
            <div style={styles.timeline}>
              {history.map((item, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusColor(item.newStatus),
                        }}
                      >
                        {item.newStatus}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.9rem", margin: 0 }}>{item.note}</p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Updated by: {item.changedBy?.name || "System"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    padding: "2.5rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
  },
  idText: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  title: { fontSize: "1.5rem", fontWeight: "800", color: "var(--text-dark)" },
  statusBadge: {
    padding: "0.4rem 1rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  section: { marginBottom: "2rem" },
  sectionTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.75rem",
  },
  descriptionBox: {
    backgroundColor: "#f9fafb",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    borderLeft: "2px solid var(--border-color)",
    paddingLeft: "1.5rem",
    marginLeft: "0.5rem",
  },
  timelineItem: { position: "relative" },
  timelineDot: {
    position: "absolute",
    left: "-1.85rem",
    top: "0.4rem",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "var(--primary-green)",
    border: "2px solid #fff",
  },
};

export default RequestDetail;
