import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, 
  ListTodo, 
  CheckCircle2, 
  UserCheck, 
  AlertOctagon, 
  Clock,
  Activity,
  BarChart,
  Map as MapIcon,
  PlayCircle,
  Eye,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Shield,
  Mail
} from 'lucide-react';

import { useCache } from '../components/CacheContext';
import Loader from '../components/Loader';

function Dashboard({ user }) {
  const { getCachedData, fetchWithCache } = useCache();
  const [stats, setStats] = useState(getCachedData('dashboard_stats') || null);
  const [loading, setLoading] = useState(!stats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchWithCache('dashboard_stats', () => api.get('/dashboard/summary/'));
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [fetchWithCache]);

  if (loading) return <Loader message="Connecting to telemetry stream..." />;

  const isAgent = user?.role === 'FIELD_AGENT';

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="status-badge status-assigned">Live Telemetry</span>
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.03em' }}>
            {isAgent ? 'Field Operative Dashboard' : 'Executive Overview'}
          </h1>
        </div>
        {isAgent && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ padding: '10px 18px', fontSize: '13px' }}>
                <Eye size={16} /> My Task Queue
              </button>
            </Link>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '10px 18px', fontSize: '13px' }}>
                <PlayCircle size={16} /> Start Field Visit
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* Executive Profile Banner */}
      {stats?.leader_profile && (
        <div className="card" style={{ padding: '28px 32px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--surface-subtle) 100%)', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '24px', fontWeight: 'bold', border: '2px solid var(--surface-hover)' }}>
              {stats.leader_profile.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.leader_profile.username}</h2>
                <span className="status-badge status-assigned" style={{ fontSize: '11px', padding: '3px 10px', textTransform: 'uppercase' }}>
                  {stats.leader_profile.role}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} style={{ color: 'var(--text-tertiary)' }} /> {stats.leader_profile.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: 'var(--shadow-sm)' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Operating Location</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.leader_profile.region}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)', boxShadow: 'var(--shadow-sm)' }}>
                <Briefcase size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Position & Unit</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.leader_profile.team}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)', boxShadow: 'var(--shadow-sm)' }}>
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Security Clearance</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.leader_profile.employee_id}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        {/* KPI 1 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {isAgent ? 'Assigned Queue' : 'Total Field Tasks'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ListTodo size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {stats?.total_tasks || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success-color)', fontWeight: '600' }}>
              <TrendingUp size={14} /> 100% Allocation
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {isAgent ? 'Pending Action' : 'Pending Operations'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-subtle)', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {stats?.pending_tasks || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--warning-color)', fontWeight: '600' }}>
              Awaiting dispatch
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {isAgent ? 'Completed Visits' : 'Completed Audits'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--success-subtle)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {stats?.completed_visits || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--success-color)', fontWeight: '600' }}>
              <ArrowUpRight size={14} /> Verified by AI
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {isAgent ? "Today's Schedule" : 'High-Risk Incidents'}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: isAgent ? 'var(--primary-subtle)' : 'var(--danger-subtle)', color: isAgent ? 'var(--primary-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isAgent ? <Calendar size={18} /> : <AlertOctagon size={18} />}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {isAgent ? stats?.todays_visits : stats?.high_risk_visits || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isAgent ? 'var(--text-secondary)' : 'var(--danger-color)', fontWeight: '600' }}>
              {isAgent ? 'Scheduled visits' : 'Immediate attention required'}
            </div>
          </div>
        </div>

      </div>

      {!isAgent && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '40px' }}>
          
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px 0', fontWeight: '700' }}>Geographic Execution Matrix</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Task breakdown across managed territories</div>
              </div>
              <MapIcon size={20} style={{ color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stats?.region_performance?.map((item, index) => (
                <div key={item.region__name || index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.region__name || 'Unassigned Zone'}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{item.count} tasks</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(item.count / Math.max(1, stats.total_tasks)) * 100}%`,
                      background: 'var(--primary-color)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
              {(!stats?.region_performance || stats.region_performance.length === 0) && (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>No regional telemetry available.</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px 0', fontWeight: '700' }}>Operational Status Matrix</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Real-time task state distribution</div>
              </div>
              <BarChart size={20} style={{ color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats?.task_distribution?.map(item => {
                let badgeClass = "status-assigned";
                if (item.status === 'COMPLETED') badgeClass = "status-completed";
                if (item.status === 'PENDING') badgeClass = "status-pending";

                return (
                  <div key={item.status} style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`status-badge ${badgeClass}`}>{item.status}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {item.count}
                    </div>
                  </div>
                );
              })}
              {(!stats?.task_distribution || stats.task_distribution.length === 0) && (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>No distribution data available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Corporate Activity Log */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: '700' }}>Audit Trail & Activity Stream</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Immutable log of field force transactions and state changes</div>
          </div>
          <Activity size={20} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {stats?.recent_activities?.map((activity, index) => (
            <div key={activity.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              padding: '16px 0', 
              borderBottom: index === stats.recent_activities.length - 1 ? 'none' : '1px solid var(--border-color)',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', width: '64px' }}>
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
              
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>@{activity.actor__username}</span>
                <span style={{ color: 'var(--text-secondary)', margin: '0 6px' }}>{activity.action.toLowerCase()}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {activity.details?.title || activity.details?.assignee || activity.details?.task_title || JSON.stringify(activity.details)}
                </span>
              </div>
            </div>
          ))}
          {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '14px' }}>No audit records found in the current stream.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
