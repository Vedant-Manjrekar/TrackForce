import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { UserPlus, Edit2, ShieldAlert, CheckCircle, XCircle, Key } from 'lucide-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

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

  useEffect(() => {
    Promise.all([fetchUsers(), fetchOptions()]).then(() => setLoading(false));
  }, []);

  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({
        username: user.username,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`,
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
        delete payload.password; // Don't update password here
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

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>User Management</h1>
        <button onClick={() => handleOpenModal('create')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{modalType === 'create' ? 'Create New User' : modalType === 'edit' ? 'Edit User' : 'Reset Password'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              
              {modalType !== 'password' && (
                <>
                  <div>
                    <label>Username</label>
                    <input required disabled={modalType==='edit'} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}} />
                  </div>
                  <div>
                    <label>Full Name</label>
                    <input required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}} />
                  </div>
                  <div>
                    <label>Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}} />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                    <div>
                      <label>Role</label>
                      <select value={formData.role_name} onChange={e => setFormData({...formData, role_name: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}}>
                        <option value="FIELD_AGENT">Field Agent</option>
                        <option value="TEAM_LEAD">Team Lead</option>
                        <option value="REGIONAL_MANAGER">Regional Manager</option>
                        <option value="AUDITOR">Auditor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label>Status</label>
                      <select value={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.value === 'true'})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                    <div>
                      <label>Region</label>
                      <select value={formData.region_id} onChange={e => setFormData({...formData, region_id: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}}>
                        <option value="">None</option>
                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Team</label>
                      <select value={formData.team_id} onChange={e => setFormData({...formData, team_id: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}}>
                        <option value="">None</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(modalType === 'create' || modalType === 'password') && (
                <div>
                  <label>{modalType === 'create' ? 'Initial Password' : 'New Password'}</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{width:'100%', padding:'10px', background:'var(--bg-color)', border:'1px solid var(--border-color)', borderRadius:'8px', color:'var(--text-primary)'}} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1 }}>{modalType === 'create' ? 'Create User' : 'Save Changes'}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'var(--border-color)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="card">
        <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Region / Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ background: 'var(--border-color)' }}>
                <td style={{ borderRadius: '8px 0 0 8px' }}>
                  <div style={{ fontWeight: '600' }}>{user.username}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                </td>
                <td>
                  <span className={`status-badge`} style={{ background: 'var(--border-color)', color: '#646cff', border: '1px solid var(--text-secondary)' }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '13px' }}>{user.region || 'No Region'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{user.team || 'No Team'}</div>
                </td>
                <td>
                  <button 
                    onClick={() => toggleStatus(user)}
                    style={{ background: 'transparent', padding: '4px', display: 'flex', alignItems: 'center', gap: '5px', color: user.is_active ? 'var(--success-color)' : 'var(--danger-color)' }}
                  >
                    {user.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {user.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleOpenModal('edit', user)} title="Edit User" style={{ background: 'var(--border-color)', padding: '6px' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleOpenModal('password', user)} title="Reset Password" style={{ background: 'var(--border-color)', padding: '6px' }}>
                      <Key size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
