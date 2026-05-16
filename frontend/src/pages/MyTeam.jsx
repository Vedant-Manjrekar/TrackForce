import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users as UsersIcon, MapPin, CheckCircle2, Clock, Activity, Target } from 'lucide-react';

function MyTeam() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/users/');
        // Backend scopes results based on TL's team
        const teamAgents = (response.data.results || response.data).filter(u => u.role === 'FIELD_AGENT');
        setAgents(teamAgents);
      } catch (err) {
        console.error("Failed to fetch team agents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <div className="p-4">Calibrating team performance metrics...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>My Field Team</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Real-time performance tracking and operational status for your assigned agents.</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <span style={{ opacity: 0.7 }}>Team Size:</span> <span style={{ fontWeight: 'bold' }}>{agents.length} Agents</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {agents.map(agent => (
          <div key={agent.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: agent.is_active ? 'var(--primary-color)20' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: agent.is_active ? 'var(--primary-color)' : 'var(--text-secondary)', fontSize: '20px', fontWeight: 'bold', border: '2px solid var(--surface-hover)' }}>
              {agent.username[0].toUpperCase()}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{agent.username}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{agent.email}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '50px', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  background: agent.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: agent.is_active ? 'var(--success-color)' : 'var(--danger-color)',
                  border: `1px solid ${agent.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}>
                  {agent.is_active ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>

              <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--primary-color)' }} /> {agent.region || 'Unassigned'}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.5px' }}>
                    <Target size={12} /> Total Tasks
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{agent.stats?.total_tasks || 0}</div>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.5px' }}>
                    <Activity size={12} /> Efficiency
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: agent.stats?.completion_rate > 70 ? 'var(--success-color)' : 'var(--warning-color)' }}>
                    {agent.stats?.completion_rate || 0}%
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Task Completion Progress</span>
                  <span>{agent.stats?.completed_tasks || 0} / {agent.stats?.total_tasks || 0}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${agent.stats?.completion_rate || 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-color), #818cf8)', borderRadius: '3px' }}></div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <button style={{ 
                  width: '100%', 
                  background: 'var(--surface-hover)', 
                  border: '1px solid var(--border-color)',
                  padding: '10px', 
                  fontSize: '13px',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} /> Individual Report
                </button>
              </div>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', border: '1px dashed var(--border-color)', background: 'transparent' }}>
            <UsersIcon size={48} style={{ margin: '0 auto 20px', opacity: 0.2, color: 'var(--primary-color)' }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>No team members found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>There are currently no field agents assigned to your operational unit.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeam;
