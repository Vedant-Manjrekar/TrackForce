import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [teams, setTeams] = useState([]);
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
        setTasks(response.data.results);
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

    fetchTasks();
    fetchOptions();
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Tasks</h1>
        <button onClick={() => setShowModal(true)}>Create New Task</button>
      </div>

      {showModal && (
        <div className="card" style={{ marginBottom: '20px', border: '1px solid #646cff' }}>
          <h2>Create Task</h2>
          <form onSubmit={handleCreateTask} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Title</label><br/>
              <input required style={{ width: '100%', padding: '8px' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Description</label><br/>
              <textarea style={{ width: '100%', padding: '8px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <div>
              <label>Priority</label><br/>
              <select style={{ width: '100%', padding: '8px' }} value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
              <label>Due Date</label><br/>
              <input required type="datetime-local" style={{ width: '100%', padding: '8px' }} value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
            </div>
            <div>
              <label>Assign To</label><br/>
              <select style={{ width: '100%', padding: '8px' }} value={formData.assigned_to} onChange={e => setFormData({...formData, assigned_to: e.target.value})}>
                <option value="">-- Unassigned --</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label>Region</label><br/>
              <select style={{ width: '100%', padding: '8px' }} value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                <option value="">-- None --</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label>Team</label><br/>
              <select style={{ width: '100%', padding: '8px' }} value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})}>
                <option value="">-- None --</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <button type="submit" style={{ marginRight: '10px' }}>Save Task</button>
              <button type="button" style={{ background: '#555' }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Region</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>
                  <span className={`status-badge status-${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.priority}</td>
                <td>{task.assigned_to_name || 'Unassigned'}</td>
                <td>{task.region_name}</td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/tasks/${task.id}`}>
                    <button style={{ padding: '4px 8px', fontSize: '12px' }}>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;
