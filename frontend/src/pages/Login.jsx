import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Sun, Moon, User as UserIcon, Lock, ArrowRight, ShieldCheck, AlertCircle, Key } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import { useCache } from '../components/CacheContext';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { clearCache } = useCache();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      const decoded = jwtDecode(response.data.access);
      clearCache();
      setUser(decoded);
    } catch (err) {
      setError('Invalid username or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { username: 'admin', role: 'System Admin', badge: 'status-pending' },
    { username: 'rm_north', role: 'Regional Manager', badge: 'status-assigned' },
    { username: 'tl_alpha', role: 'Team Lead', badge: 'status-assigned' },
    { username: 'agent_1', role: 'Field Agent', badge: 'status-completed' },
    { username: 'auditor', role: 'Compliance Auditor', badge: 'status-completed' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      
      {/* Ambient Background Glow for Premium Fintech / SaaS Aesthetic */}
      <div style={{ 
        position: 'absolute', 
        top: '-150px', 
        right: '-150px', 
        width: '600px', 
        height: '600px', 
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', 
        filter: 'blur(60px)', 
        zIndex: 0,
        pointerEvents: 'none' 
      }} />

      {/* Top Navigation */}
      <nav style={{ 
        width: '100%', 
        maxWidth: '1280px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 24px',
        zIndex: 10 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            T
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            TrackForce
          </span>
        </Link>
        <button onClick={toggleTheme} className="btn-outline" style={{ padding: '10px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '10px 24px 40px 24px',
        zIndex: 10 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '680px', /* Increased width to 680px for a grand, spacious feel */
          background: 'var(--surface-color)', 
          border: '1px solid var(--border-color)', 
          boxShadow: 'var(--shadow-xl)', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Top Brand Accent Bar */}
          <div style={{ height: '4px', background: 'var(--primary-gradient)', width: '100%' }} />

          {/* Card Body */}
          <div style={{ padding: '36px 48px' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--primary-color)' }} /> Secure Enterprise Gateway
              </div>
              <h2 style={{ fontSize: '2.4rem', margin: '0 0 10px 0', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Welcome Back
              </h2>
              <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Enter your credentials to access the TrackForce operating system.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px', 
                padding: '18px', 
                background: 'var(--danger-subtle)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '28px' 
              }}>
                <AlertCircle size={20} style={{ color: 'var(--danger-color)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--danger-color)', lineHeight: '1.5' }}>
                  {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', paddingTop: '14px', paddingBottom: '14px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                  <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Requires demo credentials</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', paddingTop: '14px', paddingBottom: '14px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16.5px', 
                  marginTop: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px' 
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
              </button>
            </form>

            {/* Demo Accounts Panel */}
            <div style={{ marginTop: '36px', background: 'var(--surface-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontSize: '14.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                <Key size={18} style={{ color: 'var(--primary-color)' }} /> Demo Accounts <span style={{ fontWeight: '400', color: 'var(--text-tertiary)' }}>(password: password123)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {demoAccounts.map(acc => (
                  <div 
                    key={acc.username} 
                    onClick={() => { setUsername(acc.username); setPassword('password123'); }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px 16px', 
                      background: 'var(--surface-color)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    title="Click to auto-fill credentials"
                  >
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{acc.username}</span>
                    <span className={`status-badge ${acc.badge}`} style={{ fontSize: '11px', padding: '4px 10px' }}>{acc.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '15.5px', color: 'var(--text-secondary)' }}>
              Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign up here</Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
