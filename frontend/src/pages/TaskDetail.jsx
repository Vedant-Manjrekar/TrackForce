import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { MessageSquare, Bot, AlertCircle } from 'lucide-react';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [visits, setVisits] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTaskData = async () => {
    try {
      const [taskRes, visitsRes] = await Promise.all([
        api.get(`/tasks/${id}/`),
        api.get(`/visits/?task=${id}`)
      ]);
      setTask(taskRes.data);
      setVisits(visitsRes.data.results);
    } catch (err) {
      console.error("Failed to fetch task details", err);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, [id]);

  const handleStartVisit = async () => {
    try {
      await api.post('/visits/', { task: id });
      fetchTaskData();
    } catch (err) {
      alert("Failed to start visit");
    }
  };

  const handleCompleteVisit = async (visitId) => {
    if (!notes) return alert("Please add notes before completing");
    setSubmitting(true);
    try {
      await api.patch(`/visits/${visitId}/`, { 
        status: 'COMPLETED',
        notes: notes
      });
      setNotes('');
      fetchTaskData();
    } catch (err) {
      alert("Failed to complete visit");
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return <div>Loading...</div>;

  const activeVisit = visits.find(v => v.status === 'STARTED');

  return (
    <div>
      <h1>Task Detail: {task.title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>Information</h3>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Region:</strong> {task.region_name}</p>
          <p><strong>Team:</strong> {task.team_name}</p>
          
          {task.status !== 'COMPLETED' && !activeVisit && (
            <button onClick={handleStartVisit} style={{ marginTop: '10px' }}>Start New Visit</button>
          )}
        </div>

        {activeVisit && (
          <div className="card" style={{ borderColor: '#646cff' }}>
            <h3>Active Visit</h3>
            <p>Started at: {new Date(activeVisit.start_time).toLocaleString()}</p>
            <textarea 
              placeholder="Add visit notes here..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', height: '100px', background: '#333', color: 'white', border: '1px solid #444', padding: '10px', marginBottom: '10px' }}
            />
            <button 
              onClick={() => handleCompleteVisit(activeVisit.id)} 
              disabled={submitting}
            >
              {submitting ? 'Processing AI Insights...' : 'Complete Visit & Submit Notes'}
            </button>
          </div>
        )}
      </div>

      <h2>Visit History & AI Insights</h2>
      {visits.filter(v => v.status === 'COMPLETED').map(visit => (
        <div key={visit.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p><strong>Completed:</strong> {new Date(visit.end_time).toLocaleString()}</p>
            <p><strong>Agent:</strong> {visit.agent_name}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
             <div style={{ flex: 1, padding: '10px', background: '#111', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#888', marginBottom: '5px' }}>
                  <MessageSquare size={16} /> <strong>Agent Notes</strong>
                </div>
                <p>{visit.notes}</p>
             </div>
             <div style={{ flex: 1, padding: '10px', background: '#1a1a2e', borderRadius: '4px', border: '1px solid #30365f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#646cff', marginBottom: '5px' }}>
                  <Bot size={16} /> <strong>AI Insight</strong>
                </div>
                <p style={{ fontStyle: 'italic' }}>{visit.ai_summary}</p>
                <p><strong>Recommendation:</strong> {visit.ai_recommendation}</p>
                <p><strong>Risk Level:</strong> 
                  <span style={{ color: visit.ai_risk_flag === 'HIGH' ? '#ef4444' : visit.ai_risk_flag === 'MEDIUM' ? '#f59e0b' : '#10b981', marginLeft: '5px' }}>
                    {visit.ai_risk_flag}
                  </span>
                </p>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskDetail;
