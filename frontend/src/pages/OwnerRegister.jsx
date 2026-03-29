import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function OwnerRegister() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/owner/dashboard');
    else setServerError(result.message);
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
            <h1>Create Account</h1>
            <p>Register as an owner to manage submissions</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your Name" className={`auth-input ${errors.name ? 'auth-input-err' : ''}`} />
              {errors.name && <span className="auth-field-err">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="owner@example.com" className={`auth-input ${errors.email ? 'auth-input-err' : ''}`} />
              {errors.email && <span className="auth-field-err">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" className={`auth-input ${errors.password ? 'auth-input-err' : ''}`} />
              {errors.password && <span className="auth-field-err">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="••••••••" className={`auth-input ${errors.confirm ? 'auth-input-err' : ''}`} />
              {errors.confirm && <span className="auth-field-err">{errors.confirm}</span>}
            </div>

            {serverError && <div className="auth-error">{serverError}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/owner/login" className="auth-link">Sign in</Link>
          </div>
        </div>

        <Link to="/" className="auth-back-link">← Back to Inquiry Form</Link>
      </div>
    </div>
  );
}