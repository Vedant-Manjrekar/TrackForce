import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Eye, Brain, MapPin, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchVisits = async () => {
    try {
      const response = await api.get('/visits/');
      setVisits(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleOpenVisit = (visit) => {
    setSelectedVisit(visit);
    setShowModal(true);
  };

  if (loading) return <div className="p-4">Loading visits...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Field Visit Monitoring</h1>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Active Visits: {visits.filter(v => v.status === 'STARTED').length}</div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Task / Agent</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(visit => (
              <tr key={visit.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{visit.task_title || 'Task #'+visit.task}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Agent: {visit.agent_username || 'Agent #'+visit.agent}</div>
                </td>
                <td>
                  <span className={`status-badge status-${visit.status.toLowerCase()}`}>
                    {visit.status === 'STARTED' ? <Clock size={12} /> : <CheckCircle size={12} />}
                    {visit.status}
                  </span>
                </td>
                <td>{new Date(visit.start_time).toLocaleString()}</td>
                <td>
                  <span style={{ 
                    color: visit.ai_risk_flag === 'HIGH' ? 'var(--danger-color)' : visit.ai_risk_flag === 'MEDIUM' ? 'var(--warning-color)' : 'var(--success-color)',
                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 'bold'
                  }}>
                    {visit.ai_risk_flag === 'HIGH' && <AlertTriangle size={14} />}
                    {visit.ai_risk_flag || 'LOW'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleOpenVisit(visit)} style={{ background: 'var(--border-color)', padding: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Eye size={16} /> View Insights
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedVisit && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '600px', border: '1px solid var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Brain style={{ color: '#818cf8' }} />
                <h2 style={{ margin: 0 }}>AI-Powered Visit Insights</h2>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', padding: 0 }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #818cf8' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#818cf8' }}>Summary</h4>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{selectedVisit.ai_summary || "No automated summary available yet."}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--success-color)' }}>Recommendation</h4>
                  <p style={{ margin: 0, fontSize: '13px' }}>{selectedVisit.ai_recommendation || "Maintain standard follow-up protocol."}</p>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--danger-color)' }}>Notes from Agent</h4>
                  <p style={{ margin: 0, fontSize: '13px' }}>{selectedVisit.notes || "No notes provided."}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Visit ID: {selectedVisit.id}</div>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--border-color)' }}>Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Visits;
