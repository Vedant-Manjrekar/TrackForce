import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Eye, Brain, MapPin, CheckCircle, Clock, AlertTriangle, X, Search, ShieldAlert, User as UserIcon } from 'lucide-react';

function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.task_title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      visit.agent_username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || visit.ai_risk_flag === riskFilter || (!visit.ai_risk_flag && riskFilter === 'LOW');
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-secondary)', fontSize: '15px' }}>Loading visits...</div>;

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="enterprise-badge">
              <MapPin size={14} /> Field Visits
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.03em' }}>Visit Monitoring</h1>
        </div>
        <div className="card" style={{ padding: '12px 20px', background: 'var(--surface-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={18} style={{ color: 'var(--primary-color)' }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Active Visits</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{visits.filter(v => v.status === 'STARTED').length}</div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search by task title or agent..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', py: '10px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Risk Level:</span>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="ALL">All</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px' }}>
              <option value="ALL">All</option>
              <option value="STARTED">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px' }}>Task & Agent</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}>Start Time</th>
              <th style={{ padding: '16px 24px' }}>Risk Level</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.map((visit, idx) => {
              let statusBadge = visit.status === 'STARTED' ? "status-pending" : "status-completed";
              
              let riskColor = "var(--success-color)";
              let riskSubtle = "var(--success-subtle)";
              if (visit.ai_risk_flag === 'HIGH') { riskColor = "var(--danger-color)"; riskSubtle = "var(--danger-subtle)"; }
              if (visit.ai_risk_flag === 'MEDIUM') { riskColor = "var(--warning-color)"; riskSubtle = "var(--warning-subtle)"; }

              return (
                <tr key={visit.id} style={{ borderBottom: idx === filteredVisits.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14.5px', marginBottom: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {visit.task_title || `Task #${visit.task}`}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserIcon size={12} /> {visit.agent_username || `Agent #${visit.agent}`}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge ${statusBadge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {visit.status === 'STARTED' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {visit.status === 'STARTED' ? 'In Progress' : 'Completed'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {new Date(visit.start_time).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: riskSubtle, color: riskColor, border: `1px solid ${riskColor}`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldAlert size={12} /> {visit.ai_risk_flag || 'LOW'} RISK
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleOpenVisit(visit)} 
                      className="btn-outline" 
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Eye size={14} /> View Insights
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredVisits.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No field visits found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AI Insights Modal */}
      {showModal && selectedVisit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', border: '1px solid rgba(37, 99, 235, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <Brain size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>AI Visit Insights</h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Visit ID: #{selectedVisit.id}</div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ background: 'var(--primary-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Summary</h4>
                <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{selectedVisit.ai_summary || "No automated summary available yet."}"
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'var(--surface-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--success-color)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Recommendation</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.5' }}>
                    {selectedVisit.ai_recommendation || "Maintain standard protocol."}
                  </p>
                </div>

                <div style={{ background: 'var(--surface-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agent Notes</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {selectedVisit.notes || "No notes provided."}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Visits;
