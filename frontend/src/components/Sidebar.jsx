import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  ClipboardList, 
  LogOut, 
  User as UserIcon, 
  Map as MapIcon, 
  Users as UsersIcon, 
  BarChart3, 
  Settings as SettingsIcon,
  MapPin,
  Sun,
  Moon,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from './ThemeContext';

function Sidebar({ onLogout, user }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  let menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.75} /> },
  ];

  if (user && user.role === 'ADMIN') {
    menuItems.push(
      { name: 'Tasks', path: '/tasks', icon: <ListTodo size={20} strokeWidth={1.75} /> },
      { name: 'Users', path: '/users', icon: <UserIcon size={20} strokeWidth={1.75} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} stroke="var(--text-secondary)" strokeWidth={1.75} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} strokeWidth={1.75} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} strokeWidth={1.75} /> },
      { name: 'Regions', path: '/regions', icon: <MapIcon size={20} strokeWidth={1.75} /> },
      { name: 'Teams', path: '/teams', icon: <UsersIcon size={20} strokeWidth={1.75} /> },
      { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} strokeWidth={1.75} /> }
    );
  } else if (user && user.role === 'TEAM_LEAD') {
    menuItems.push(
      { name: 'Tasks', path: '/tasks', icon: <ListTodo size={20} strokeWidth={1.75} /> },
      { name: 'My Team', path: '/my-team', icon: <UsersIcon size={20} strokeWidth={1.75} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} strokeWidth={1.75} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} strokeWidth={1.75} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} strokeWidth={1.75} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} strokeWidth={1.75} /> }
    );
  } else if (user && user.role === 'AUDITOR') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} strokeWidth={1.75} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} strokeWidth={1.75} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} strokeWidth={1.75} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} strokeWidth={1.75} /> }
    );
  } else if (user && user.role === 'REGIONAL_MANAGER') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} strokeWidth={1.75} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} strokeWidth={1.75} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} strokeWidth={1.75} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} strokeWidth={1.75} /> }
    );
  } else {
    // Field Agents
    menuItems.push(
      { name: 'My Tasks', path: '/tasks', icon: <ListTodo size={20} strokeWidth={1.75} /> },
      { name: 'My Visits', path: '/visits', icon: <MapPin size={20} strokeWidth={1.75} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} strokeWidth={1.75} /> }
    );
  }

  // Deduplicate
  menuItems = menuItems.filter((v,i,a)=>a.findIndex(t=>(t.path === v.path))===i);

  return (
    <div className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      
      {/* Top Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px', flexShrink: 0 }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--primary-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
            F
          </div>
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            FieldOps
          </h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, paddingRight: '4px', marginBottom: '20px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px', 
                  padding: '10px 14px', 
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'var(--primary-subtle)' : 'transparent',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  if(!isActive) {
                    e.currentTarget.style.background = 'var(--surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if(!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {React.cloneElement(item.icon, { 
                  style: { 
                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                    transition: 'color 0.15s ease'
                  } 
                })}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', 
            background: 'var(--primary-gradient)', 
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '16px'
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', marginTop: '2px' }}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={toggleTheme}
            className="btn-outline"
            style={{ 
              flex: 1,
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={onLogout} 
            className="btn-outline"
            style={{ 
              flex: 1,
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger-color)',
              borderColor: 'var(--border-color)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--danger-subtle)';
              e.currentTarget.style.borderColor = 'var(--danger-color)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
            title="Logout"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
