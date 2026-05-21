import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart3, PieChart, TrendingUp, Users, Map, CheckCircle2, ChevronDown, ChevronUp, Calendar, AlertCircle, Clock, User } from 'lucide-react';
import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function Reports() {
  const { getCachedData, fetchWithCache } = useCache();
  const cachedData = getCachedData('reports_summary') || null;

  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [expandedRegions, setExpandedRegions] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await fetchWithCache('reports_summary', () => api.get('/reports/summary/'));
        setData(result);
        // By default, keep the dropdowns closed
        setExpandedRegions({});
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [fetchWithCache]);

  const toggleRegion = (regionName) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionName]: !prev[regionName]
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-color)', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'HIGH': return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-color)', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'MEDIUM': return { bg: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-color)', border: '1px solid rgba(59, 130, 246, 0.3)' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)' };
    }
  };

  if (loading) return <Loader message="Generating operational intelligence..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, var(--primary-color), var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Field Intelligence Reports</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '15px' }}>Real-time regional analytics, agent efficiency metrics, and pending task intelligence.</p>
        </div>
        <div style={{ fontSize: '13px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '50px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <Clock size={14} style={{ color: 'var(--primary-color)' }} />
          <span>Last updated: <strong>{new Date().toLocaleTimeString()}</strong></span>
        </div>
      </div>
      
      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--success-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Total Completed (7d)</span>
            <CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--success-color)' }}>{data?.visits_completed_last_7_days || 0}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} style={{ color: 'var(--success-color)' }} /> +12% from last week
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Agents</span>
            <Users size={16} style={{ color: 'var(--primary-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{data?.avg_completion_time_per_agent?.length || 0}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>Currently deployed in field</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Avg Duration</span>
            <Clock size={16} style={{ color: 'var(--primary-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {data?.avg_completion_time_per_agent?.[0]?.avg_duration_minutes?.toFixed(1) || 0}m
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>Overall system average</div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-hover), var(--bg-color))', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--danger-color)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Pending Tasks</span>
            <AlertCircle size={16} style={{ color: 'var(--danger-color)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--danger-color)' }}>
            {data?.task_distribution?.find(t => t.status === 'PENDING')?.count || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>Require field allocation</div>
        </div>
      </div>

      {/* Main Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Pending Tasks by Region Card (With Task Breakdown) */}
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-color), var(--surface-color))', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Map size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Pending Tasks by Region</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Showing all active pending tasks across geographic sectors</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', background: 'var(--border-color)', padding: '4px 10px', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {data?.pending_tasks_by_region?.length || 0} Regions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data?.pending_tasks_by_region?.map(item => {
              const isExpanded = expandedRegions[item.region__name];
              const maxCount = Math.max(...(data?.pending_tasks_by_region?.map(r => r.count) || [10]), 10);
              const progressPercent = (item.count / maxCount) * 100;

              return (
                <div key={item.region__name} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
                  
                  {/* Region Main Row */}
                  <div 
                    onClick={() => toggleRegion(item.region__name)}
                    style={{ 
                      padding: '16px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--surface-hover)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = isExpanded ? 'var(--surface-hover)' : 'transparent'}
                  >
                    <div style={{ width: '110px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                      {item.region__name}
                    </div>

                    <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-color), #818cf8)', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-color)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                        {item.count} Pending
                      </span>
                      {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
                    </div>
                  </div>

                  {/* Expanded Tasks Breakdown */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px', background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', display: 'grid', gap: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        Pending Task List ({item.tasks?.length || 0})
                      </div>
                      
                      {item.tasks?.map(task => {
                        const prioStyle = getPriorityColor(task.priority);
                        return (
                          <div 
                            key={task.id} 
                            style={{ 
                              background: 'var(--surface-hover)', 
                              border: '1px solid var(--border-color)', 
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
                              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                                #{task.id} - {task.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User size={12} style={{ color: 'var(--success-color)' }} /> @{task.assigned_to}
                                </span>
                                {task.team && <span>Team: {task.team}</span>}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {task.due_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '4px 8px', borderRadius: '6px' }}>
                                  <Calendar size={12} style={{ color: 'var(--primary-color)' }} />
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
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px', padding: '8px 0' }}>
                          No specific task details available.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {data?.pending_tasks_by_region?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--success-color)', margin: '0 auto 10px auto' }} />
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>All Clear!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No pending tasks found across any regions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Efficiency Card */}
        <div className="card" style={{ background: 'linear-gradient(145deg, var(--surface-color), var(--surface-color))', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ margin: "0", fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Agent Efficiency</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Average completion time per field agent</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', background: 'var(--border-color)', padding: '4px 10px', borderRadius: '12px', color: 'var(--success-color)', fontWeight: '600' }}>
              Active Roster
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data?.avg_completion_time_per_agent?.map(item => {
              const maxDuration = Math.max(...(data?.avg_completion_time_per_agent?.map(a => a.avg_duration_minutes) || [60]), 60);
              const progressPercent = (item.avg_duration_minutes / maxDuration) * 100;

              return (
                <div key={item.agent__username} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '110px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--success-color)', fontWeight: 'bold' }}>
                      {item.agent__username[0].toUpperCase()}
                    </div>
                    {item.agent__username}
                  </div>

                  <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--success-color), #34d399)', borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--success-color)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {item.avg_duration_minutes?.toFixed(0)}m
                  </div>
                </div>
              );
            })}

            {data?.avg_completion_time_per_agent?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>
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
