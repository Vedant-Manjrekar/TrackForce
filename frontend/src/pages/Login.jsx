import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      const decoded = jwtDecode(response.data.access);
      setUser(decoded);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Field Ops Login</h2>
        <p className="auth-subtitle">Log in to manage your field operations.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              required
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
          <button type="submit" className="auth-submit-btn">Login</button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '13px', color: '#94a3b8', borderTop: '1px solid #333', paddingTop: '20px' }}>
          <p style={{ fontWeight: '600', marginBottom: '8px', color: '#cbd5e1' }}>Demo Accounts (password: password123):</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>• admin</div>
            <div>• rm_north (RM)</div>
            <div>• tl_alpha (TL)</div>
            <div>• agent_1 (Agent)</div>
            <div>• auditor</div>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
