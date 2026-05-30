import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { MessageSquare, Bot, AlertCircle, Calendar, User as UserIcon, MapPin, Flag, PlayCircle, CheckCircle2, Clock, ArrowLeft, ShieldAlert } from 'lucide-react';
import Loader from '../components/Loader';
import { jwtDecode } from 'jwt-decode';

function TaskDetail({ user }) {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [visits, setVisits] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(user || null);

  useEffect(() => {
    if (!currentUser) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          setCurrentUser(jwtDecode(token));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user, currentUser]);

  const fetchTaskData = async () => {
    try {
      const [taskRes, visitsRes] = await Promise.all([
        api.get(`/tasks/${id}/`),
        api.get(`/visits/?task=${id}`)
      ]);
      setTask(taskRes.data);
      setVisits(visitsRes.data.results || visitsRes.data);
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
    if (!notes.trim()) return alert("Please add notes before completing the visit.");
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

  if (!task) return <Loader message="Loading task details..." />;

  const activeVisit = visits.find(v => v.status === 'STARTED');
  
  let statusBadge = "status-assigned";
  if (task.status === 'COMPLETED') statusBadge = "status-completed";
  if (task.status === 'PENDING') statusBadge = "status-pending";

  let priorityColor = "var(--text-primary)";
  if (task.priority === 'HIGH') priorityColor = "var(--danger-color)";
  if (task.priority === 'MEDIUM') priorityColor = "var(--warning-color)";
  if (task.priority === 'LOW') priorityColor = "var(--success-color)";

  return (
    <div>
      {/* Navigation Breadcrumb & Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to="/tasks" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
            <ArrowLeft size={16} /> Back to Tasks
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span className={`status-badge ${statusBadge}`}>{task.status}</span>
            <span className="enterprise-badge" style={{ color: priorityColor, borderColor: priorityColor }}>
              <Flag size={12} /> {task.priority} Priority
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            {task.title}
          </h1>
        </div>

        {task.status !== 'COMPLETED' && !activeVisit && currentUser?.role !== 'TEAM_LEAD' && (
          <button onClick={handleStartVisit} style={{ padding: '12px 24px', fontSize: '14px' }}>
            <PlayCircle size={18} /> Start Visit
          </button>
        )}
      </div>

      {/* Task Details & Active Visit Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: activeVisit ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '40px' }}>
        
        {/* Task Details Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flag size={20} style={{ color: 'var(--primary-color)' }} /> Task Details
          </h3>
          
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</div>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6', background: 'var(--surface-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              {task.description || 'No description provided.'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <MapPin size={16} /> Region
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{task.region_name || 'None'}</div>
            </div>

            <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <UserIcon size={16} /> Assigned Team
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{task.team_name || 'Unassigned'}</div>
            </div>
          </div>
        </div>

        {/* Active Visit Card */}
        {activeVisit && (
          <div className="card" style={{ borderColor: 'var(--primary-color)', boxShadow: '0 0 0 2px var(--primary-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
                <Clock size={20} /> Current Visit
              </h3>
              <span className="status-badge status-pending" style={{ animation: 'pulse 2s infinite' }}>In Progress</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Calendar size={16} /> 
              <span>Started at: <strong style={{ color: 'var(--text-primary)' }}>{new Date(activeVisit.start_time).toLocaleString()}</strong></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit Notes</label>
              <textarea 
                placeholder="Write your visit notes here..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', height: '140px', padding: '16px', resize: 'none', flex: 1 }}
              />
            </div>

            <button 
              onClick={() => handleCompleteVisit(activeVisit.id)} 
              disabled={submitting}
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              {submitting ? 'Generating AI Summary...' : 'Complete Visit'}
            </button>
          </div>
        )}
      </div>

      {/* Visit History & AI Insights */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <Bot size={24} style={{ color: 'var(--primary-color)' }} /> Visit History & AI Insights
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {visits.filter(v => v.status === 'COMPLETED').map((visit, index) => {
            let riskColor = "var(--success-color)";
            let riskSubtle = "var(--success-subtle)";
            if (visit.ai_risk_flag === 'HIGH') { riskColor = "var(--danger-color)"; riskSubtle = "var(--danger-subtle)"; }
            if (visit.ai_risk_flag === 'MEDIUM') { riskColor = "var(--warning-color)"; riskSubtle = "var(--warning-subtle)"; }

            return (
              <div key={visit.id} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                      #{visits.length - index}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Agent: {visit.agent_name || 'System'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Completed: {new Date(visit.end_time).toLocaleString()}</div>
                    </div>
                  </div>

                  <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: riskSubtle, color: riskColor, border: `1px solid ${riskColor}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} /> {visit.ai_risk_flag || 'LOW'} RISK
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                  
                  {/* Agent Notes */}
                  <div style={{ padding: '20px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <MessageSquare size={16} /> Agent Notes
                    </div>
                    <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      {visit.notes || 'No notes provided.'}
                    </p>
                  </div>

                  {/* AI Insights */}
                  <div style={{ padding: '20px', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Bot size={16} /> AI Summary & Insights
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Summary</div>
                      <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                        "{visit.ai_summary || 'No AI summary available.'}"
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(37, 99, 235, 0.2)', paddingTop: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Recommendation</div>
                      <p style={{ margin: 0, fontSize: '14.5px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                        {visit.ai_recommendation || 'None'}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
          {visits.filter(v => v.status === 'COMPLETED').length === 0 && (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No completed visits recorded for this task.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
