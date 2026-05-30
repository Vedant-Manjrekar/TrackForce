import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users as UsersIcon, MapPin, CheckCircle2, Clock, Activity, Target, X, Flag, Calendar, ArrowRight, ListTodo } from 'lucide-react';
import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function MyTeam() {
  const { getCachedData, fetchWithCache } = useCache();
  const cachedUsers = getCachedData('users') || [];
  const initialAgents = cachedUsers.filter(u => u.role === 'FIELD_AGENT');
  
  const [agents, setAgents] = useState(initialAgents);
  const [loading, setLoading] = useState(initialAgents.length === 0);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || null;
  const [agentTasks, setAgentTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await fetchWithCache('users', () => api.get('/users/'));
        const teamAgents = data.filter(u => u.role === 'FIELD_AGENT');
        setAgents(teamAgents);
      } catch (err) {
        console.error("Failed to fetch team agents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [fetchWithCache]);

  const handleSelectAgent = async (agent) => {
    setSelectedAgentId(agent.id);
    setLoadingTasks(true);
    try {
      const response = await api.get(`/tasks/?assigned_to=${agent.id}`);
      setAgentTasks(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch agent tasks", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  if (loading) return <Loader message="Calibrating team performance metrics..." />;

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
          <div 
            key={agent.id} 
            className="card" 
            onClick={() => handleSelectAgent(agent)}
            style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
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
                  <MapPin size={14} style={{ color: 'var(--primary-color)' }} /> {agent.region || 'Unassigned Region'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <UsersIcon size={14} style={{ color: 'var(--primary-color)' }} /> {agent.team || 'Unassigned Team'}
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
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSelectAgent(agent); }}
                  style={{ 
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

      {/* Agent Details & Tasks Modal */}
      {selectedAgent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: selectedAgent.is_active ? 'var(--primary-color)20' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedAgent.is_active ? 'var(--primary-color)' : 'var(--text-secondary)', fontSize: '24px', fontWeight: 'bold', border: '2px solid var(--surface-hover)' }}>
                  {selectedAgent.username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedAgent.username}</h2>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '50px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      background: selectedAgent.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: selectedAgent.is_active ? 'var(--success-color)' : 'var(--danger-color)',
                      border: `1px solid ${selectedAgent.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                      {selectedAgent.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{selectedAgent.email}</div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} style={{ color: 'var(--primary-color)' }} /> {selectedAgent.region || 'Unassigned Region'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UsersIcon size={14} style={{ color: 'var(--primary-color)' }} /> {selectedAgent.team || 'Unassigned Team'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAgentId(null)} className="btn-outline" style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Metrics Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  <Target size={14} /> Total Tasks Assigned
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedAgent.stats?.total_tasks || 0}</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  <CheckCircle2 size={14} /> Completed Tasks
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-color)' }}>{selectedAgent.stats?.completed_tasks || 0}</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  <Activity size={14} /> Efficiency Rate
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: selectedAgent.stats?.completion_rate > 70 ? 'var(--success-color)' : 'var(--warning-color)' }}>
                  {selectedAgent.stats?.completion_rate || 0}%
                </div>
              </div>
            </div>

            {/* Assigned Tasks Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ListTodo size={18} style={{ color: 'var(--primary-color)' }} />
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>Assigned Tasks</h3>
              </div>

              {loadingTasks ? (
                <Loader message="Fetching assigned tasks..." />
              ) : agentTasks.length > 0 ? (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', fontSize: '11px' }}>Task</th>
                        <th style={{ padding: '12px 16px', fontSize: '11px' }}>Status</th>
                        <th style={{ padding: '12px 16px', fontSize: '11px' }}>Priority</th>
                        <th style={{ padding: '12px 16px', fontSize: '11px' }}>Due Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentTasks.map((task, idx) => {
                        let statusBadge = "status-assigned";
                        if (task.status === 'COMPLETED') statusBadge = "status-completed";
                        if (task.status === 'PENDING') statusBadge = "status-pending";

                        let priorityColor = "var(--text-primary)";
                        if (task.priority === 'HIGH' || task.priority === 'CRITICAL') priorityColor = "var(--danger-color)";
                        if (task.priority === 'MEDIUM') priorityColor = "var(--warning-color)";
                        if (task.priority === 'LOW') priorityColor = "var(--success-color)";

                        return (
                          <tr key={task.id} style={{ borderBottom: idx === agentTasks.length - 1 ? 'none' : '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                            <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13.5px', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {task.title}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {task.description || 'No description'}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span className={`status-badge ${statusBadge}`} style={{ fontSize: '10px', padding: '3px 8px' }}>
                                {task.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ color: priorityColor, fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Flag size={12} /> {task.priority}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} /> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <Link to={`/tasks/${task.id}`}>
                                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  View <ArrowRight size={12} />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                  <ListTodo size={32} style={{ margin: '0 auto 12px', opacity: 0.3, color: 'var(--primary-color)' }} />
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>No Tasks Assigned</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>This team member currently has no active or completed tasks.</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setSelectedAgentId(null)} style={{ padding: '10px 24px', fontSize: '14px' }}>
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default MyTeam;
