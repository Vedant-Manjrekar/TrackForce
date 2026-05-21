import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  User, 
  Lock, 
  Save, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function Settings() {
  const { getCachedData, setCachedData, fetchWithCache } = useCache();
  const cachedProfile = getCachedData('users_me') || null;

  const [activeTab, setActiveTab] = useState('Profile');
  const [userProfile, setUserProfile] = useState(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: cachedProfile?.full_name || '',
    email: cachedProfile?.email || '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchWithCache('users_me', () => api.get('/users/me/'));
        setUserProfile(data);
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name || '',
          email: data.email || ''
        }));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [fetchWithCache]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch('/users/me/', {
        full_name: formData.full_name,
        email: formData.email
      });
      setUserProfile(response.data);
      setCachedData('users_me', response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/users/${userProfile.id}/reset_password/`, { password: formData.new_password });
      alert("Password reset successfully!");
      setFormData({ ...formData, new_password: '', confirm_password: '' });
    } catch (err) {
      alert("Error resetting password");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'Profile', icon: <User size={18} />, label: 'Profile Settings' },
    { id: 'Password', icon: <Lock size={18} />, label: 'Security & Password' },
  ];

  if (loading) return <Loader message="Accessing global configuration..." />;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>Global Settings</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your personal account information and security credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#818cf8' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer'
              }}
            >
              {tab.icon}
              <span style={{ fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card" style={{ minHeight: '500px' }}>
          <h2 style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>{activeTab}</h2>

          {activeTab === 'Profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
              <div>
                <label>Full Name</label>
                <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Role</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{userProfile?.role}</div>
                </div>
                {userProfile?.role === 'FIELD_AGENT' && (
                  <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Team Name</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{userProfile?.team || 'No Team'}</div>
                  </div>
                )}
              </div>
              {userProfile?.role === 'FIELD_AGENT' && (
                <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Team Lead's Name</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{userProfile?.team_lead_name || 'No Team Lead'}</div>
                </div>
              )}
              <button type="submit" disabled={saving} style={{ width: 'fit-content', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                Update Profile
              </button>
            </form>
          )}

          {activeTab === 'Password' && (
            <form onSubmit={handlePasswordReset} style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
              <div>
                <label>New Password</label>
                <input required type="password" value={formData.new_password} onChange={e => setFormData({...formData, new_password: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input required type="password" value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning-color)', fontSize: '13px', background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px' }}>
                <AlertTriangle size={16} />
                <span>Resetting your password will end all active sessions.</span>
              </div>
              <button type="submit" disabled={saving} style={{ width: 'fit-content', padding: '12px 30px', background: 'var(--danger-color)' }}>
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
