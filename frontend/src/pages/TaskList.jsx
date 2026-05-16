import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ListTodo, Search, Flag, Calendar, User as UserIcon, MapPin, Plus, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    due_date: '',
    assigned_to: '',
    region: '',
    team: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks/');
        setTasks(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    
    const fetchOptions = async () => {
      try {
        const [usersRes, regionsRes, teamsRes] = await Promise.all([
          api.get('/users/').catch(() => ({ data: { results: [] } })),
          api.get('/regions/').catch(() => ({ data: { results: [] } })),
          api.get('/teams/').catch(() => ({ data: { results: [] } }))
        ]);
        setUsers(usersRes.data.results || usersRes.data || []);
        setRegions(regionsRes.data.results || regionsRes.data || []);
        setTeams(teamsRes.data.results || teamsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };

    Promise.all([fetchTasks(), fetchOptions()]).then(() => setLoading(false));
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.region) delete payload.region;
      if (!payload.team) delete payload.team;
      
      await api.post('/tasks/', payload);
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'LOW', due_date: '', assigned_to: '', region: '', team: '' });
      
      const response = await api.get('/tasks/');
      setTasks(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigned_to_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.region_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-secondary)', fontSize: '15px' }}>Loading tasks...</div>;

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="enterprise-badge">
              <ListTodo size={14} /> Task Management
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.03em' }}>Active Tasks</h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', fontSize: '14px' }}>
          <Plus size={18} /> Create New Task
        </button>
      </header>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search tasks by title, assignee, or region..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', py: '10px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Priority:</span>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="ALL">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="STARTED">Started</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px' }}>Task</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}>Priority</th>
              <th style={{ padding: '16px 24px' }}>Assignee</th>
              <th style={{ padding: '16px 24px' }}>Region / Due Date</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, idx) => {
              let statusBadge = "status-assigned";
              if (task.status === 'COMPLETED') statusBadge = "status-completed";
              if (task.status === 'PENDING') statusBadge = "status-pending";

              let priorityColor = "var(--text-primary)";
              if (task.priority === 'HIGH' || task.priority === 'CRITICAL') priorityColor = "var(--danger-color)";
              if (task.priority === 'MEDIUM') priorityColor = "var(--warning-color)";
              if (task.priority === 'LOW') priorityColor = "var(--success-color)";

              return (
                <tr key={task.id} style={{ borderBottom: idx === filteredTasks.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14.5px', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {task.description || 'No description'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge ${statusBadge}`}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ color: priorityColor, fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flag size={14} /> {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>
                        {task.assigned_to_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {task.assigned_to_name || 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{task.region_name || 'Global'}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Link to={`/tasks/${task.id}`}>
                      <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        View <ArrowRight size={14} />
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No tasks found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: '800' }}>Create New Task</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Fill in the details below to create and assign a new task.
            </p>

            <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Task Title</label>
                <input 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Quarterly Compliance Audit" 
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Provide detailed instructions..."
                  style={{ height: '100px', padding: '12px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Priority</label>
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Due Date</label>
                <input 
                  required 
                  type="datetime-local" 
                  value={formData.due_date} 
                  onChange={e => setFormData({...formData, due_date: e.target.value})} 
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Assign To</label>
                <select value={formData.assigned_to} onChange={e => setFormData({...formData, assigned_to: e.target.value})}>
                  <option value="">-- Unassigned --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Region</label>
                <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                  <option value="">-- None --</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Team</label>
                <select value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})}>
                  <option value="">-- None --</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px' }}>Save Task</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
