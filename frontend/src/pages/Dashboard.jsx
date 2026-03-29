import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import api from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const { owner, logout } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/submissions', {
        params: { search, sort, page, limit: 10 }
      });
      setSubmissions(data.submissions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/owner/login'); }
      else setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [search, sort, page, logout, navigate]);

  useEffect(() => {
    const timer = setTimeout(fetchSubmissions, 300);
    return () => clearTimeout(timer);
  }, [fetchSubmissions]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/submissions/${id}`);
      setDeleteId(null);
      fetchSubmissions();
    } catch {
      alert('Failed to delete submission');
    }
  };

  const handleLogout = () => { logout(); navigate('/owner/login'); };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-sidebar-top">
          <div className="db-logo">
            <span className="db-logo-icon">◆</span>
            <span>InquiryHub</span>
          </div>
          <nav className="db-nav">
            <div className="db-nav-item db-nav-active">
              <span className="db-nav-icon">📋</span>
              <span>Submissions</span>
            </div>
            <Link to="/form" target="_blank" className="db-nav-item">
              <span className="db-nav-icon">🌐</span>
              <span>Public Form</span>
            </Link>
          </nav>
        </div>
        <div className="db-sidebar-bottom">
          <div className="db-owner-info">
            <div className="db-owner-avatar">{owner?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="db-owner-name">{owner?.name}</div>
              <div className="db-owner-email">{owner?.email}</div>
            </div>
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="db-main">
        {/* Top bar */}
        <header className="db-topbar">
          <div>
            <h1 className="db-page-title">Submissions</h1>
            <p className="db-page-sub">
              {total > 0 ? `${total} total entr${total === 1 ? 'y' : 'ies'}` : 'No submissions yet'}
            </p>
          </div>
          <div className="db-stats-chips">
            <div className="db-chip">
              <span className="db-chip-val">{total}</span>
              <span className="db-chip-label">Total</span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="db-filters">
          <div className="db-search-wrap">
            <span className="db-search-icon">🔍</span>
            <input
              className="db-search"
              placeholder="Search by name, email, phone or query..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="db-search-clear" onClick={() => { setSearch(''); setPage(1); }}>✕</button>
            )}
          </div>
          <select
            className="db-sort-select"
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="db-loading">
            <div className="db-loading-spinner" />
            <p>Loading submissions…</p>
          </div>
        ) : error ? (
          <div className="db-error-state">
            <p>{error}</p>
            <button className="db-retry-btn" onClick={fetchSubmissions}>Retry</button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="db-empty">
            <div className="db-empty-icon">📭</div>
            <h3>No submissions found</h3>
            <p>{search ? 'Try a different search term' : 'Submissions from the public form will appear here'}</p>
          </div>
        ) : (
          <>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>DOB</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr key={s._id} className="db-row">
                      <td className="db-row-num">{(page - 1) * 10 + i + 1}</td>
                      <td>
                        <div className="db-name-cell">
                          <div className="db-avatar">{s.name[0].toUpperCase()}</div>
                          <div>
                            <div className="db-name">{s.name}</div>
                            <div className="db-address-short">{s.address.substring(0, 30)}{s.address.length > 30 ? '…' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="db-email">{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{formatDate(s.dateOfBirth)}</td>
                      <td>{formatDate(s.createdAt)}</td>
                      <td>
                        <div className="db-actions">
                          <Link to={`/owner/submissions/${s._id}`} className="db-btn-view">View</Link>
                          <button className="db-btn-delete" onClick={() => setDeleteId(s._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="db-pagination">
                <button className="db-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                <div className="db-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`db-page-num ${p === page ? 'db-page-active' : ''}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  ))}
                </div>
                <button className="db-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="db-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-icon">🗑️</div>
            <h3>Delete Submission?</h3>
            <p>This action cannot be undone.</p>
            <div className="db-modal-actions">
              <button className="db-modal-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="db-modal-confirm" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}