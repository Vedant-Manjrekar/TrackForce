import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sun, Moon, User as UserIcon, Lock, Mail, MapPin, Users, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'FIELD_AGENT',
    region: '',
    team: '',
  });
  
  const [regions, setRegions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [regionsRes, teamsRes] = await Promise.all([
          api.get('/regions/'),
          api.get('/teams/')
        ]);
        setRegions(regionsRes.data.results || regionsRes.data);
        setTeams(teamsRes.data.results || teamsRes.data);
      } catch (err) {
        console.error("Failed to fetch regions/teams", err);
      }
    };
    fetchOptions();
  }, []);

  const validateForm = () => {
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please verify your entries.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long for enterprise security.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.region) delete payload.region;
      if (!payload.team) delete payload.team;

      await api.post('/users/register/', payload);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      console.error("Signup failed", err);
      const errorMsg = err.response?.data 
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') 
        : "Signup failed. Please check your network connection.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden'
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
        padding: '32px 24px',
        zIndex: 10 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            F
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            FieldOps
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
        padding: '20px 24px 60px 24px',
        zIndex: 10 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '680px', /* Increased width for a majestic, spacious feel */
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
          <div style={{ padding: '48px 48px' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--primary-color)' }} /> Field Agent Provisioning
              </div>
              <h2 style={{ fontSize: '2.4rem', margin: '0 0 10px 0', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Create Your Account
              </h2>
              <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Join the FieldOps Pro network to manage and execute field allocations.
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••••••"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                      style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Region Assignment</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <select 
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px', background: 'var(--surface-color)' }}
                    >
                      <option value="">-- Select Region --</option>
                      {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>Team Allocation</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <select 
                      value={formData.team}
                      onChange={(e) => setFormData({...formData, team: e.target.value})}
                      style={{ width: '100%', paddingLeft: '52px', paddingRight: '18px', py: '14px', fontSize: '16px', background: 'var(--surface-color)' }}
                    >
                      <option value="">-- Select Team --</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
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
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: '36px', textAlign: 'center', fontSize: '15.5px', color: 'var(--text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
