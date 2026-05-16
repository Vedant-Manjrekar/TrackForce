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
  Calendar
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

  if (loading) return <div className="p-4">Syncing operational data...</div>;

  const isAgent = user?.role === 'FIELD_AGENT';

  const adminCards = [
    { title: 'Total Users', value: stats?.total_users, icon: <Users size={20} />, color: '#6366f1' },
    { title: 'Total Tasks', value: stats?.total_tasks, icon: <ListTodo size={20} />, color: '#818cf8' },
    { title: 'Pending Tasks', value: stats?.pending_tasks, icon: <Clock size={20} />, color: '#f59e0b' },
    { title: 'Completed Visits', value: stats?.completed_visits, icon: <CheckCircle2 size={20} />, color: '#10b981' },
    { title: 'Active Agents', value: stats?.active_agents, icon: <UserCheck size={20} />, color: '#06b6d4' },
    { title: 'High-Risk Visits', value: stats?.high_risk_visits, icon: <AlertOctagon size={20} />, color: '#ef4444' },
  ];

  const agentCards = [
    { title: 'Assigned Tasks', value: stats?.total_tasks, icon: <ListTodo size={20} />, color: '#6366f1' },
    { title: 'Pending Tasks', value: stats?.pending_tasks, icon: <Clock size={20} />, color: '#f59e0b' },
    { title: 'Completed Visits', value: stats?.completed_visits, icon: <CheckCircle2 size={20} />, color: '#10b981' },
    { title: "Today's Visits", value: stats?.todays_visits, icon: <Calendar size={20} />, color: '#06b6d4' },
  ];

  const statCards = isAgent ? agentCards : adminCards;

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{isAgent ? 'My Field Dashboard' : 'Operational Dashboard'}</h1>
          <p style={{ color: '#888', margin: 0 }}>
            {isAgent ? `Welcome back, ${user.username}. Here is your field activity summary.` : 'Real-time summary of field force activities and performance metrics.'}
          </p>
        </div>
        {isAgent && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6366f1' }}>
                <PlayCircle size={18} /> Start Visit
              </button>
            </Link>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2a2a2a' }}>
                <Eye size={18} /> View My Tasks
              </button>
            </Link>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isAgent ? '250px' : '200px'}, 1fr))`, gap: '20px', marginBottom: '30px' }}>
        {statCards.map((card, index) => (
          <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: `${card.color}20`, color: card.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div style={{ fontSize: '14px', color: '#888' }}>{card.title}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{card.value || 0}</div>
          </div>
        ))}
      </div>

      {!isAgent && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BarChart size={18} style={{ color: '#6366f1' }} />
              <h3 style={{ margin: 0 }}>Task Distribution</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {stats?.task_distribution?.map(item => (
                <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '100px', fontSize: '13px' }}>{item.status}</div>
                  <div style={{ flex: 1, height: '10px', background: '#121212', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(item.count / stats.total_tasks) * 100}%`, 
                      height: '100%', 
                      background: item.status === 'COMPLETED' ? '#10b981' : item.status === 'PENDING' ? '#f59e0b' : '#6366f1' 
                    }}></div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <MapIcon size={18} style={{ color: '#818cf8' }} />
              <h3 style={{ margin: 0 }}>Region Performance</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {stats?.region_performance?.map(item => (
                <div key={item.region__name} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '100px', fontSize: '13px' }}>{item.region__name || 'Unknown'}</div>
                  <div style={{ flex: 1, height: '10px', background: '#121212', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(item.count / stats.total_tasks) * 100}%`, 
                      height: '100%', 
                      background: '#818cf8' 
                    }}></div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity size={18} style={{ color: '#ef4444' }} />
          <h3 style={{ margin: 0 }}>{isAgent ? 'My Recent Activities' : 'Recent Activities'}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {stats?.recent_activities?.map((activity, index) => (
            <div key={activity.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              padding: '12px', 
              borderBottom: index === stats.recent_activities.length - 1 ? 'none' : '1px solid #121212',
              fontSize: '14px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>{activity.actor__username}</span>
                <span style={{ color: '#888' }}> {activity.action.toLowerCase()} </span>
                <span style={{ color: '#cbd5e1' }}>
                  {activity.details?.title || activity.details?.assignee || activity.details?.task_title || JSON.stringify(activity.details)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#444' }}>No recent activities found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
