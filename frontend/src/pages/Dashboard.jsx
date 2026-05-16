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
  ArrowRight
} from 'lucide-react';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/summary/');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontFamily: 'var(--font-heading)' }}>
      Gathering Intelligence...
    </div>
  );

  const isAgent = user?.role === 'FIELD_AGENT';

  return (
    <div>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border-color)', paddingBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: '56px', margin: 0, lineHeight: '0.9', maxWidth: '600px' }}>
            {isAgent ? 'Field Activity & Operations' : 'Global Command Center'}
          </h1>
        </div>
        {isAgent && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} /> View Tasks
              </button>
            </Link>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlayCircle size={18} /> Start Visit
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* Asymmetrical Top Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '32px', marginBottom: '48px' }}>
        
        {/* Massive Hero Stat Card */}
        <div className="card" style={{ background: 'var(--primary-color)', borderColor: 'var(--primary-color)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px' }}>
          <div className="editorial-badge" style={{ background: 'var(--surface-color)', color: 'var(--text-primary)' }}>Priority Metric</div>
          <div>
            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAgent ? <ListTodo size={18}/> : <CheckCircle2 size={18}/>}
              {isAgent ? 'Total Assigned Tasks' : 'Total Completed Visits'}
            </div>
            <div style={{ fontSize: '96px', fontFamily: 'var(--font-heading)', lineHeight: '1', margin: '-10px 0 0 -5px' }}>
              {isAgent ? stats?.total_tasks : stats?.completed_visits || 0}
            </div>
          </div>
          <div style={{ borderTop: '2px solid rgba(255,255,255,0.2)', paddingTop: '24px', marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Overall progression</span>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Vertical Stack of Secondary Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Pending Tasks
            </div>
            <div style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', color: 'var(--warning-color)', lineHeight: 1 }}>
              {stats?.pending_tasks || 0}
            </div>
          </div>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAgent ? <Calendar size={16}/> : <UserCheck size={16}/>}
              {isAgent ? "Today's Visits" : "Active Agents"}
            </div>
            <div style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', color: 'var(--success-color)', lineHeight: 1 }}>
              {isAgent ? stats?.todays_visits : stats?.active_agents || 0}
            </div>
          </div>
        </div>

        {/* Third Column Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {!isAgent && (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} /> Total Users
              </div>
              <div style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {stats?.total_users || 0}
              </div>
            </div>
          )}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--danger-color)', color: '#fff', borderColor: 'var(--danger-color)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={16} /> High-Risk
            </div>
            <div style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {stats?.high_risk_visits || 0}
            </div>
          </div>
        </div>

      </div>

      {!isAgent && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', marginBottom: '48px' }}>
          
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapIcon size={24} style={{ color: 'var(--primary-color)' }} />
              Region Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {stats?.region_performance?.map((item, index) => (
                <div key={item.region__name || index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    <span>{item.region__name || 'Unknown Zone'}</span>
                    <span>{item.count}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--surface-hover)', width: '100%', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, bottom: 0, 
                      width: `${(item.count / Math.max(1, stats.total_tasks)) * 100}%`,
                      background: 'var(--text-primary)'
                    }} />
                  </div>
                </div>
              ))}
              {(!stats?.region_performance || stats.region_performance.length === 0) && (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No region data available.</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BarChart size={24} style={{ color: 'var(--primary-color)' }} />
              Task Distribution Matrix
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              {stats?.task_distribution?.map(item => {
                let color = 'var(--text-primary)';
                if (item.status === 'COMPLETED') color = 'var(--success-color)';
                if (item.status === 'PENDING') color = 'var(--warning-color)';

                return (
                  <div key={item.status} style={{ flex: '1 1 150px', border: '2px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      {item.status}
                    </div>
                    <div style={{ fontSize: '40px', fontFamily: 'var(--font-heading)', color: color, lineHeight: 1 }}>
                      {item.count}
                    </div>
                  </div>
                );
              })}
              {(!stats?.task_distribution || stats.task_distribution.length === 0) && (
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No task data available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div style={{ marginTop: '48px' }}>
        <h3 style={{ fontSize: '32px', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={28} />
          {isAgent ? 'Recent Movements' : 'Live Activity Stream'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {stats?.recent_activities?.map((activity, index) => (
            <div key={activity.id} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '24px', 
              padding: '24px 0', 
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', width: '60px', paddingTop: '4px' }}>
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              
              <div style={{ 
                width: '12px', height: '12px', 
                background: 'var(--primary-color)', 
                marginTop: '6px',
                outline: '2px solid var(--bg-color)',
                outlineOffset: '-2px'
              }} />
              
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px' }}>@{activity.actor__username}</span>
                <span style={{ color: 'var(--text-secondary)', margin: '0 8px', fontStyle: 'italic' }}>— {activity.action.toLowerCase()} —</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {activity.details?.title || activity.details?.assignee || activity.details?.task_title || JSON.stringify(activity.details)}
                </span>
              </div>
            </div>
          ))}
          {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
            <div style={{ padding: '40px 0', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '16px' }}>The system is quiet. No recent activities recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
