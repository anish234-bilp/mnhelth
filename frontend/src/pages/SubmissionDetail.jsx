import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import api from '../api';
import './SubmissionDetail.css';

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/submissions/${id}`);
        setSubmission(data);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/owner/login'); }
        else setError('Submission not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, logout, navigate]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (loading) return (
    <div className="sd-loading">
      <div className="sd-spinner" />
      <p>Loading submission…</p>
    </div>
  );

  if (error) return (
    <div className="sd-error">
      <h2>⚠️ {error}</h2>
      <Link to="/owner/dashboard" className="sd-back-btn">← Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="sd-root">
      <div className="sd-bg-orb" />

      <div className="sd-container">
        {/* Back */}
        <Link to="/owner/dashboard" className="sd-back">← Back to Dashboard</Link>

        {/* Header card */}
        <div className="sd-hero-card">
          <div className="sd-avatar">{submission.name[0].toUpperCase()}</div>
          <div className="sd-hero-info">
            <h1 className="sd-hero-name">{submission.name}</h1>
            <div className="sd-hero-meta">
              <span>📧 {submission.email}</span>
              <span>📞 {submission.phone}</span>
            </div>
          </div>
          <div className="sd-submitted-badge">
            <span className="sd-badge-dot" />
            Submitted {formatDateTime(submission.createdAt)}
          </div>
        </div>

        {/* Info grid */}
        <div className="sd-grid">
          <InfoCard icon="🎂" label="Date of Birth" value={formatDate(submission.dateOfBirth)} />
          <InfoCard icon="📍" label="Address" value={submission.address} />
          <InfoCard icon="📧" label="Email Address" value={submission.email} wide />
          <InfoCard icon="📞" label="Phone Number" value={submission.phone} />
        </div>

        {/* Query card */}
        <div className="sd-query-card">
          <div className="sd-query-header">
            <span className="sd-query-icon">💬</span>
            <span className="sd-query-label">Inquiry / Query</span>
          </div>
          <p className="sd-query-text">{submission.query}</p>
        </div>

        {/* Footer meta */}
        <div className="sd-meta-row">
          <span className="sd-meta-item">🆔 ID: <code>{submission._id}</code></span>
          <span className="sd-meta-item">🕐 Submitted: {formatDateTime(submission.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, wide }) {
  return (
    <div className={`sd-info-card ${wide ? 'sd-wide' : ''}`}>
      <div className="sd-info-icon">{icon}</div>
      <div>
        <div className="sd-info-label">{label}</div>
        <div className="sd-info-value">{value}</div>
      </div>
    </div>
  );
}