import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users as UsersIcon, Plus, Trash2, Edit2, X, MapPin, UserCheck, TrendingUp, ChevronRight, Search, Filter, Activity, Award, CheckCircle2 } from 'lucide-react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [regions, setRegions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', region: '', lead_id: '', agent_ids: [] });

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const fetchData = async () => {
    try {
      const [teamsRes, regionsRes, usersRes] = await Promise.all([
        api.get('/teams/'),
        api.get('/regions/'),
        api.get('/users/')
      ]);
      setTeams(teamsRes.data.results || teamsRes.data);
      setRegions(regionsRes.data.results || regionsRes.data);
      setAllUsers(usersRes.data.results || usersRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (team = null) => {
    setCurrentTeam(team);
    if (team) {
      const lead = allUsers.find(u => u.team === team.name && u.role === 'TEAM_LEAD');
      const agents = allUsers.filter(u => u.team === team.name && u.role === 'FIELD_AGENT').map(u => u.id);
      
      setFormData({
        name: team.name,
        region: team.region,
        lead_id: lead ? lead.id : '',
        agent_ids: agents
      });
    } else {
      setFormData({ name: '', region: '', lead_id: '', agent_ids: [] });
    }
    setShowModal(true);
  };

  const handleViewDetails = (team) => {
    setCurrentTeam(team);
    setShowDetails(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let teamId = currentTeam?.id;
      if (currentTeam) {
        await api.put(`/teams/${currentTeam.id}/`, { name: formData.name, region: formData.region });
      } else {
        const res = await api.post('/teams/', { name: formData.name, region: formData.region });
        teamId = res.data.id;
      }

      const updates = [];
      if (formData.lead_id) {
        updates.push(api.patch(`/users/${formData.lead_id}/`, { team_id: teamId }));
      }
      formData.agent_ids.forEach(id => {
        updates.push(api.patch(`/users/${id}/`, { team_id: teamId }));
      });

      await Promise.all(updates);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Error saving team or updating memberships");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this team?")) {
      try {
        await api.delete(`/teams/${id}/`);
        fetchData();
      } catch (err) {
        alert("Error deleting team");
      }
    }
  };

  const leadOptions = allUsers.filter(u => u.role === 'TEAM_LEAD' || u.role === 'ADMIN');
  const agentOptions = allUsers.filter(u => u.role === 'FIELD_AGENT');

  // Filtered teams calculation
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.region_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.lead_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || team.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // KPI Calculations
  const totalAgents = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
  const activeVisits = teams.reduce((acc, team) => acc + (team.performance_stats?.active_visits || 0), 0);
  const avgCompletion = teams.length > 0 ? 
    (teams.reduce((acc, team) => acc + parseFloat(team.performance_stats?.completion_rate || '0'), 0) / teams.length).toFixed(1) : 0;

  if (loading) return <div className="p-4">Loading team environment...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, var(--success-color), var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Field Teams</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '15px' }}>Organize field agents, track leadership, and monitor regional operational metrics.</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--success-color) 0%, #059669 100%)', border: 'none', padding: '10px 20px', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          <Plus size={18} /> Create Team
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--success-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Teams</span>
            <UsersIcon size={18} style={{ color: 'var(--success-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{teams.length}</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Field Agents</span>
            <UserCheck size={18} style={{ color: 'var(--primary-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalAgents}</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--warning-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Task Completion</span>
            <Award size={18} style={{ color: 'var(--warning-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{avgCompletion}%</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid #ec4899', padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Visits</span>
            <Activity size={18} style={{ color: '#ec4899' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{activeVisits}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-color)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px', background: 'var(--surface-color)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input 
            placeholder="Search teams by name, lead, or region..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', padding: 0, color: 'var(--text-secondary)' }}><X size={16} /></button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)', marginRight: '4px' }} />
          <button 
            onClick={() => setSelectedRegion('ALL')} 
            style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid var(--border-color)', background: selectedRegion === 'ALL' ? 'var(--success-color)' : 'var(--surface-color)', color: selectedRegion === 'ALL' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            All Regions
          </button>
          {regions.map(r => (
            <button 
              key={r.id}
              onClick={() => setSelectedRegion(r.id)} 
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid var(--border-color)', background: selectedRegion === r.id ? 'var(--success-color)' : 'var(--surface-color)', color: selectedRegion === r.id ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{currentTeam ? 'Edit Team' : 'Create Team'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', padding: 0, color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Team Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Region</label>
                <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                  <option value="">Select Region</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Assign Team Lead</label>
                <select value={formData.lead_id} onChange={e => setFormData({...formData, lead_id: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                  <option value="">No Lead Assigned</option>
                  {leadOptions.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Select Agents (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple value={formData.agent_ids} onChange={e => setFormData({...formData, agent_ids: Array.from(e.target.selectedOptions, o => o.value)})} style={{ width: '100%', height: '120px', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                  {agentOptions.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>Currently {formData.agent_ids.length} agents selected.</div>
              </div>
              <button type="submit" style={{ width: '100%', marginTop: '10px', background: 'var(--success-color)', color: 'var(--text-primary)', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>{currentTeam ? 'Save Changes' : 'Create Team'}</button>
            </form>
          </div>
        </div>
      )}

      {showDetails && currentTeam && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', padding: '0', overflow: 'hidden', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--success-color), #059669)', padding: '30px', color: 'var(--text-primary)', position: 'relative' }}>
              <button onClick={() => setShowDetails(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'var(--text-primary)', padding: 0, border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Team Performance</div>
              <h1 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)', fontSize: '28px', fontWeight: '800' }}>{currentTeam.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', fontSize: '14px', fontWeight: '500' }}>
                <MapPin size={14} /> {currentTeam.region_name}
              </div>
            </div>
            
            <div style={{ padding: '25px', display: 'grid', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '5px', fontWeight: '500' }}>Completion Rate</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--success-color)' }}>{currentTeam.performance_stats?.completion_rate}</div>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '5px', fontWeight: '500' }}>Active Visits</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{currentTeam.performance_stats?.active_visits}</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <UserCheck size={16} /> Team Lead
                </h4>
                <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--border-color), var(--border-color))', border: '1px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 'bold', color: 'var(--success-color)' }}>
                    {currentTeam.lead_name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>@{currentTeam.lead_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assigned Leadership</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <UsersIcon size={16} /> Team Members ({currentTeam.members?.length || 0})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {currentTeam.members?.map(m => (
                    <div key={m} style={{ background: 'var(--bg-color)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                      @{m}
                    </div>
                  ))}
                  {currentTeam.members?.length === 0 && (
                    <div style={{ gridColumn: 'span 2', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px', padding: '10px 0' }}>No agents assigned to this team yet.</div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--surface-color)', textAlign: 'right', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setShowDetails(false)} style={{ background: 'var(--border-color)', color: 'var(--text-primary)', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredTeams.map(team => {
          const compRateNumber = parseFloat(team.performance_stats?.completion_rate || '0');
          const activeVisitsCount = team.performance_stats?.active_visits || 0;

          return (
            <div 
              key={team.id} 
              className="card team-card" 
              style={{ 
                cursor: 'pointer', 
                background: 'linear-gradient(145deg, var(--surface-color), var(--surface-color))', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px', 
                padding: '24px', 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }} 
              onClick={() => handleViewDetails(team)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--success-color)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
              }}
            >
              {/* Top Row: Region Pill & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <MapPin size={12} /> {team.region_name}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(team); }} 
                    style={{ background: 'var(--border-color)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', color: 'var(--text-primary)', transition: 'all 0.2s', cursor: 'pointer' }} 
                    title="Edit Team"
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--success-color)'; e.currentTarget.style.borderColor = 'var(--success-color)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(team.id); }} 
                    style={{ background: 'var(--border-color)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '6px', color: 'var(--danger-color)', transition: 'all 0.2s', cursor: 'pointer' }} 
                    title="Delete Team"
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'var(--danger-color)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--border-color)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Team Name */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {team.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <UserCheck size={14} style={{ color: 'var(--primary-color)' }} /> 
                  <span>Lead: <strong style={{ color: 'var(--text-primary)' }}>@{team.lead_name}</strong></span>
                </div>
              </div>

              {/* Progress & Metrics Section */}
              <div style={{ background: 'var(--surface-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} style={{ color: compRateNumber >= 70 ? 'var(--success-color)' : compRateNumber >= 40 ? 'var(--warning-color)' : 'var(--danger-color)' }} />
                    Task Completion
                  </span>
                  <span style={{ fontWeight: '700', color: compRateNumber >= 70 ? 'var(--success-color)' : compRateNumber >= 40 ? 'var(--warning-color)' : 'var(--danger-color)' }}>
                    {team.performance_stats?.completion_rate}
                  </span>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${compRateNumber}%`, 
                    background: compRateNumber >= 70 ? 'linear-gradient(90deg, var(--success-color), #34d399)' : compRateNumber >= 40 ? 'linear-gradient(90deg, var(--warning-color), #fbbf24)' : 'linear-gradient(90deg, var(--danger-color), #f87171)', 
                    borderRadius: '3px',
                    transition: 'width 0.5s ease-in-out'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Active Field Visits</span>
                  <span style={{ background: activeVisitsCount > 0 ? 'rgba(236, 72, 153, 0.15)' : 'var(--border-color)', color: activeVisitsCount > 0 ? '#ec4899' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {activeVisitsCount > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', display: 'inline-block', animation: 'pulse 2s infinite' }} />}
                    {activeVisitsCount} Active
                  </span>
                </div>
              </div>

              {/* Bottom Row: Members & Details Arrow */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {team.members?.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {team.members.slice(0, 4).map((m, i) => (
                        <div 
                          key={m} 
                          title={`@${m}`}
                          style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            background: `hsl(${i * 45 + 120}, 60%, 30%)`, 
                            border: '2px solid var(--surface-color)', 
                            color: 'var(--text-primary)',
                            fontSize: '11px', 
                            fontWeight: '600',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            marginLeft: i > 0 ? '-10px' : '0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}
                        >
                          {m[0].toUpperCase()}
                        </div>
                      ))}
                      {team.members.length > 4 && (
                        <div style={{ fontSize: '11px', fontWeight: '600', marginLeft: '8px', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '2px 6px', borderRadius: '10px' }}>
                          +{team.members.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No agents assigned</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)', fontSize: '13px', fontWeight: '600' }}>
                  <span>View Team</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          );
        })}
        {filteredTeams.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'var(--surface-color)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
            <UsersIcon size={40} style={{ color: 'var(--text-secondary)', marginBottom: '10px' }} />
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>No teams found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Try adjusting your search query or region filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
