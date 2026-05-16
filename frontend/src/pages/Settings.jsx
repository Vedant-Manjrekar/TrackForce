import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  User, 
  Lock, 
  Save, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me/');
        setUserProfile(response.data);
        setFormData({
          ...formData,
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/users/me/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      });
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

  if (loading) return <div className="p-4 text-gray-400">Initializing settings console...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>Global Settings</h1>
        <p style={{ color: '#888', margin: 0 }}>Manage your personal account information and security credentials.</p>
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
                color: activeTab === tab.id ? '#818cf8' : '#888',
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
          <h2 style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #222' }}>{activeTab}</h2>

          {activeTab === 'Profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label>First Name</label>
                  <input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label>Last Name</label>
                  <input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>
              <div>
                <label>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div style={{ background: '#121212', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                <div style={{ color: '#888', fontSize: '12px' }}>Role</div>
                <div style={{ fontWeight: 'bold', color: '#6366f1' }}>{userProfile?.role}</div>
              </div>
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
                <input required type="password" value={formData.new_password} onChange={e => setFormData({...formData, new_password: e.target.value})} style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input required type="password" value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} style={{ width: '100%', padding: '12px', background: '#121212', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', fontSize: '13px', background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px' }}>
                <AlertTriangle size={16} />
                <span>Resetting your password will end all active sessions.</span>
              </div>
              <button type="submit" disabled={saving} style={{ width: 'fit-content', padding: '12px 30px', background: '#ef4444' }}>
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
