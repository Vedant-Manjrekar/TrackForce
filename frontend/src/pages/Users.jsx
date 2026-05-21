import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { UserPlus, Edit2, CheckCircle, XCircle, Key, Search, ShieldCheck, UserCheck, ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function Users() {
  const { getCachedData, fetchWithCache } = useCache();
  const cachedUsers = getCachedData('users') || [];
  const cachedRegions = getCachedData('regions') || [];
  const cachedTeams = getCachedData('teams') || [];

  const [users, setUsers] = useState(cachedUsers);
  const [regions, setRegions] = useState(cachedRegions);
  const [teams, setTeams] = useState(cachedTeams);
  const [loading, setLoading] = useState(cachedUsers.length === 0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role_name: 'FIELD_AGENT',
    region_id: '',
    team_id: '',
    is_active: true
  });

  const fetchUsers = useCallback(async () => {
    try {
      const data = await fetchWithCache('users', () => api.get('/users/'));
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [fetchWithCache]);

  const fetchOptions = useCallback(async () => {
    try {
      const [regionsData, teamsData] = await Promise.all([
        fetchWithCache('regions', () => api.get('/regions/')),
        fetchWithCache('teams', () => api.get('/teams/'))
      ]);
      setRegions(regionsData);
      setTeams(teamsData);
    } catch (err) {
      console.error("Failed to fetch regions/teams", err);
    }
  }, [fetchWithCache]);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchOptions()]).then(() => setLoading(false));
  }, [fetchUsers, fetchOptions]);

  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({
        username: user.username,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        role_name: user.role,
        region_id: regions.find(r => r.name === user.region)?.id || '',
        team_id: teams.find(t => t.name === user.team)?.id || '',
        is_active: user.is_active,
        password: ''
      });
    } else {
      setFormData({
        username: '',
        full_name: '',
        email: '',
        password: '',
        role_name: 'FIELD_AGENT',
        region_id: '',
        team_id: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'create') {
        await api.post('/users/register/', formData);
      } else if (modalType === 'edit') {
        const payload = { ...formData };
        delete payload.password;
        await api.patch(`/users/${selectedUser.id}/`, payload);
      } else if (modalType === 'password') {
        await api.post(`/users/${selectedUser.id}/reset_password/`, { password: formData.password });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user.id}/`, { is_active: !user.is_active });
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loader message="Loading user directory..." />;

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="enterprise-badge">
              <UsersIcon size={14} /> User Directory
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.03em' }}>User Management</h1>
        </div>
        <button onClick={() => handleOpenModal('create')} style={{ padding: '12px 24px', fontSize: '14px' }}>
          <UserPlus size={18} /> Add User
        </button>
      </header>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search by username, email, or role..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', py: '10px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Filter Role:</span>
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '10px 16px', width: '180px' }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="REGIONAL_MANAGER">Regional Manager</option>
            <option value="AUDITOR">Auditor</option>
            <option value="FIELD_AGENT">Field Agent</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px' }}>User</th>
              <th style={{ padding: '16px 24px' }}>Role</th>
              <th style={{ padding: '16px 24px' }}>Region / Team</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => {
              let badgeStyle = "status-assigned";
              if (user.role === 'ADMIN') badgeStyle = "status-pending"; // warning/amber
              if (user.role === 'AUDITOR') badgeStyle = "status-completed"; // success/green

              return (
                <tr key={user.id} style={{ borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14.5px', marginBottom: '2px' }}>{user.username}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge ${badgeStyle}`}>
                      {user.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{user.region || 'Global'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{user.team || 'None'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button 
                      onClick={() => toggleStatus(user)}
                      className="btn-outline"
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '12.5px', 
                        fontWeight: '600',
                        color: user.is_active ? 'var(--success-color)' : 'var(--danger-color)',
                        borderColor: user.is_active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                        background: user.is_active ? 'var(--success-subtle)' : 'var(--danger-subtle)'
                      }}
                      title="Toggle Active Status"
                    >
                      {user.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenModal('edit', user)} 
                        className="btn-outline" 
                        style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('password', user)} 
                        className="btn-outline" 
                        style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                        title="Reset Password"
                      >
                        <Key size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Provision / Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: '800' }}>
              {modalType === 'create' ? 'Create New User' : modalType === 'edit' ? 'Edit User' : 'Reset Password'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {modalType === 'create' ? 'Enter the details for the new user account.' : modalType === 'edit' ? 'Update role, region, and team assignments.' : 'Set a new password for this user.'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {modalType !== 'password' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Username</label>
                    <input 
                      required 
                      disabled={modalType === 'edit'} 
                      value={formData.username} 
                      onChange={e => setFormData({...formData, username: e.target.value})} 
                      placeholder="johndoe"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input 
                      required 
                      value={formData.full_name} 
                      onChange={e => setFormData({...formData, full_name: e.target.value})} 
                      placeholder="John Doe"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      placeholder="john@example.com"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Role</label>
                      <select value={formData.role_name} onChange={e => setFormData({...formData, role_name: e.target.value})}>
                        <option value="FIELD_AGENT">Field Agent</option>
                        <option value="TEAM_LEAD">Team Lead</option>
                        <option value="REGIONAL_MANAGER">Regional Manager</option>
                        <option value="AUDITOR">Auditor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</label>
                      <select value={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.value === 'true'})}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Region</label>
                      <select value={formData.region_id} onChange={e => setFormData({...formData, region_id: e.target.value})}>
                        <option value="">None (Global)</option>
                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Team</label>
                      <select value={formData.team_id} onChange={e => setFormData({...formData, team_id: e.target.value})}>
                        <option value="">None</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(modalType === 'create' || modalType === 'password') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{modalType === 'create' ? 'Password' : 'New Password'}</label>
                  <input 
                    required 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    placeholder="••••••••••••"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px' }}>{modalType === 'create' ? 'Create User' : 'Save Changes'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
