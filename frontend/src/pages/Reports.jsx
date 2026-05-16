import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart3, PieChart, TrendingUp, Users, Map, CheckCircle2, ChevronDown, ChevronUp, Calendar, AlertCircle, Clock, User } from 'lucide-react';

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/summary/');
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const toggleRegion = (regionName) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionName]: !prev[regionName]
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'HIGH': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'MEDIUM': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)' };
    }
  };

  if (loading) return <div className="p-4">Generating operational intelligence...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Field Intelligence Reports</h1>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '15px' }}>Real-time regional analytics, agent efficiency metrics, and pending task intelligence.</p>
        </div>
        <div style={{ fontSize: '13px', background: '#1e1e1e', border: '1px solid #333', padding: '8px 16px', borderRadius: '50px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <Clock size={14} style={{ color: '#6366f1' }} />
          <span>Last updated: <strong>{new Date().toLocaleTimeString()}</strong></span>
        </div>
      </div>
      
      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ background: 'linear-gradient(145deg, #1a1a1a, #121212)', border: '1px solid #2a2a2a', borderLeft: '4px solid #10b981', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Total Completed (7d)</span>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{data?.visits_completed_last_7_days || 0}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} style={{ color: '#10b981' }} /> +12% from last week
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, #1a1a1a, #121212)', border: '1px solid #2a2a2a', borderLeft: '4px solid #3b82f6', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Agents</span>
            <Users size={16} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{data?.avg_completion_time_per_agent?.length || 0}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Currently deployed in field</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, #1a1a1a, #121212)', border: '1px solid #2a2a2a', borderLeft: '4px solid #6366f1', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Avg Duration</span>
            <Clock size={16} style={{ color: '#6366f1' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366f1' }}>
            {data?.avg_completion_time_per_agent?.[0]?.avg_duration_minutes?.toFixed(1) || 0}m
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Overall system average</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, #1a1a1a, #121212)', border: '1px solid #2a2a2a', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Critical Tasks</span>
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
            {data?.task_distribution?.find(t => t.status === 'PENDING')?.count || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Require immediate intervention</div>
        </div>
      </div>

      {/* Main Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Pending Tasks by Region Card (With Task Breakdown) */}
        <div className="card" style={{ background: 'linear-gradient(145deg, #1c1c1c, #141414)', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #252525' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Map size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'white' }}>Pending Tasks by Region</h3>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Click on a region to view specific pending tasks</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', background: '#252525', padding: '4px 10px', borderRadius: '12px', color: '#aaa', fontWeight: '600' }}>
              {data?.pending_tasks_by_region?.length || 0} Regions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data?.pending_tasks_by_region?.map(item => {
              const isExpanded = expandedRegions[item.region__name];
              const maxCount = Math.max(...(data?.pending_tasks_by_region?.map(r => r.count) || [10]), 10);
              const progressPercent = (item.count / maxCount) * 100;

              return (
                <div key={item.region__name} style={{ background: '#161616', border: '1px solid #282828', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
                  
                  {/* Region Main Row */}
                  <div 
                    onClick={() => toggleRegion(item.region__name)}
                    style={{ 
                      padding: '16px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      cursor: 'pointer',
                      background: isExpanded ? '#1a1a1a' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                    onMouseLeave={e => e.currentTarget.style.background = isExpanded ? '#1a1a1a' : 'transparent'}
                  >
                    <div style={{ width: '110px', fontSize: '14px', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                      {item.region__name}
                    </div>

                    <div style={{ flex: 1, height: '8px', background: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                        {item.count} Pending
                      </span>
                      {isExpanded ? <ChevronUp size={18} style={{ color: '#888' }} /> : <ChevronDown size={18} style={{ color: '#888' }} />}
                    </div>
                  </div>

                  {/* Expanded Tasks Breakdown */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px', background: '#121212', borderTop: '1px solid #222', display: 'grid', gap: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        Pending Task List ({item.tasks?.length || 0})
                      </div>
                      
                      {item.tasks?.map(task => {
                        const prioStyle = getPriorityColor(task.priority);
                        return (
                          <div 
                            key={task.id} 
                            style={{ 
                              background: '#181818', 
                              border: '1px solid #2a2a2a', 
                              padding: '14px 16px', 
                              borderRadius: '10px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', lineHeight: '1.3' }}>
                                #{task.id} - {task.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#888' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User size={12} style={{ color: '#10b981' }} /> @{task.assigned_to}
                                </span>
                                {task.team && <span>Team: {task.team}</span>}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {task.due_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#aaa', background: '#222', padding: '4px 8px', borderRadius: '6px' }}>
                                  <Calendar size={12} style={{ color: '#a855f7' }} />
                                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              <span style={{ background: prioStyle.bg, color: prioStyle.color, border: prioStyle.border, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {item.tasks?.length === 0 && (
                        <div style={{ color: '#666', fontStyle: 'italic', fontSize: '13px', padding: '8px 0' }}>
                          No specific task details available.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {data?.pending_tasks_by_region?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: '#161616', borderRadius: '12px', border: '1px dashed #333', color: '#888' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 10px auto' }} />
                <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>All Clear!</h4>
                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>No pending tasks found across any regions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Efficiency Card */}
        <div className="card" style={{ background: 'linear-gradient(145deg, #1c1c1c, #141414)', border: '1px solid #2d2d2d', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #252525' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'white' }}>Agent Efficiency</h3>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Average completion time per field agent</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', background: '#252525', padding: '4px 10px', borderRadius: '12px', color: '#10b981', fontWeight: '600' }}>
              Active Roster
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data?.avg_completion_time_per_agent?.map(item => {
              const maxDuration = Math.max(...(data?.avg_completion_time_per_agent?.map(a => a.avg_duration_minutes) || [60]), 60);
              const progressPercent = (item.avg_duration_minutes / maxDuration) * 100;

              return (
                <div key={item.agent__username} style={{ background: '#161616', border: '1px solid #252525', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '110px', fontSize: '14px', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2a2a2a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                      {item.agent__username[0].toUpperCase()}
                    </div>
                    {item.agent__username}
                  </div>

                  <div style={{ flex: 1, height: '8px', background: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {item.avg_duration_minutes?.toFixed(0)}m
                  </div>
                </div>
              );
            })}

            {data?.avg_completion_time_per_agent?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
                No completed visit data available to calculate agent efficiency.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;
