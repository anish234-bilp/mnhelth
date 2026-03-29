import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './PublicForm.css';

const initialState = {
  name: '', email: '', phone: '', dateOfBirth: '', address: '', query: ''
};

export default function PublicForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.phone.match(/^[0-9+\-\s()]{7,15}$/)) e.phone = 'Valid phone number is required';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.query.trim() || form.query.length < 10) e.query = 'Query must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      await api.post('/submissions', form);
      setStatus('success');
      setMessage('Your inquiry has been received. We will be in touch soon!');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pf-root">
      {/* Background decoration */}
      <div className="pf-bg-orb pf-orb1" />
      <div className="pf-bg-orb pf-orb2" />

      <div className="pf-container">
        {/* Header */}
        <header className="pf-header">
          <div className="pf-logo">
            <span className="pf-logo-icon">◆</span>
            <span className="pf-logo-text">InquiryHub</span>
          </div>
          <Link to="/owner/login" className="pf-owner-link">
            Owner Portal →
          </Link>
        </header>

        {/* Hero */}
        <div className="pf-hero">
          <p className="pf-hero-tag">We'd love to hear from you</p>
          <h1 className="pf-hero-title">Submit Your<br /><em>Inquiry</em></h1>
          <p className="pf-hero-sub">Fill in your details and we'll get back to you as soon as possible.</p>
        </div>

        {/* Form Card */}
        <div className="pf-card">
          {status === 'success' ? (
            <div className="pf-success">
              <div className="pf-success-icon">✓</div>
              <h2>Inquiry Submitted!</h2>
              <p>{message}</p>
              <button className="pf-btn" onClick={() => setStatus(null)}>Submit Another</button>
            </div>
          ) : (
            <form className="pf-form" onSubmit={handleSubmit} noValidate>
              <div className="pf-row">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
              </div>
              <div className="pf-row">
                <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
                <Field label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
              </div>
              <Field label="Full Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123 Main Street, City, State, PIN" />
              <div className="pf-field">
                <label className="pf-label">Your Query</label>
                <textarea
                  name="query"
                  value={form.query}
                  onChange={handleChange}
                  placeholder="Describe your inquiry in detail..."
                  className={`pf-input pf-textarea ${errors.query ? 'pf-input-error' : ''}`}
                  rows={4}
                />
                {errors.query && <span className="pf-error">{errors.query}</span>}
              </div>

              {status === 'error' && (
                <div className="pf-alert-error">{message}</div>
              )}

              <button type="submit" className="pf-btn pf-btn-submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <span className="pf-spinner" />
                ) : (
                  <>Submit Inquiry <span>→</span></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div className="pf-field">
      <label className="pf-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pf-input ${error ? 'pf-input-error' : ''}`}
      />
      {error && <span className="pf-error">{error}</span>}
    </div>
  );
}