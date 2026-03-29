import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function OwnerLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Both fields are required'); return; }
    const result = await login(form.email, form.password);
    if (result.success) navigate('/owner/dashboard');
    else setError(result.message);
  };

  return (
    <div className="auth-root">
      <div className="auth-bg-pattern" />
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">◆</span>
            <span>InquiryHub</span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Owner Portal</h1>
            <p>Sign in to access your dashboard</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="owner@example.com"
                className="auth-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/owner/register" className="auth-link">Register here</Link>
          </div>
        </div>

        <Link to="/" className="auth-back-link">← Back to Inquiry Form</Link>
      </div>
    </div>
  );
}