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
  Moon
} from 'lucide-react';
import { useTheme } from './ThemeContext';

function Sidebar({ onLogout, user }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  let menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} strokeWidth={1.5} /> },
  ];

  if (user && user.role === 'ADMIN') {
    menuItems.push(
      { name: 'Tasks', path: '/tasks', icon: <ListTodo size={22} strokeWidth={1.5} /> },
      { name: 'Users', path: '/users', icon: <UserIcon size={22} strokeWidth={1.5} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={22} strokeWidth={1.5} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} strokeWidth={1.5} /> },
      { name: 'Activity', path: '/logs', icon: <ClipboardList size={22} strokeWidth={1.5} /> },
      { name: 'Regions', path: '/regions', icon: <MapIcon size={22} strokeWidth={1.5} /> },
      { name: 'Teams', path: '/teams', icon: <UsersIcon size={22} strokeWidth={1.5} /> },
      { name: 'Settings', path: '/settings', icon: <SettingsIcon size={22} strokeWidth={1.5} /> }
    );
  } else if (user && user.role === 'TEAM_LEAD') {
    menuItems.push(
      { name: 'Tasks', path: '/tasks', icon: <ListTodo size={22} strokeWidth={1.5} /> },
      { name: 'My Team', path: '/my-team', icon: <UsersIcon size={22} strokeWidth={1.5} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={22} strokeWidth={1.5} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} strokeWidth={1.5} /> },
      { name: 'Activity', path: '/logs', icon: <ClipboardList size={22} strokeWidth={1.5} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={22} strokeWidth={1.5} /> }
    );
  } else if (user && user.role === 'AUDITOR') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={22} strokeWidth={1.5} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} strokeWidth={1.5} /> },
      { name: 'Activity', path: '/logs', icon: <ClipboardList size={22} strokeWidth={1.5} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={22} strokeWidth={1.5} /> }
    );
  } else if (user && user.role === 'REGIONAL_MANAGER') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={22} strokeWidth={1.5} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={22} strokeWidth={1.5} /> },
      { name: 'Activity', path: '/logs', icon: <ClipboardList size={22} strokeWidth={1.5} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={22} strokeWidth={1.5} /> }
    );
  } else {
    // Field Agents
    menuItems.push(
      { name: 'My Tasks', path: '/tasks', icon: <ListTodo size={22} strokeWidth={1.5} /> },
      { name: 'My Visits', path: '/visits', icon: <MapPin size={22} strokeWidth={1.5} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={22} strokeWidth={1.5} /> }
    );
  }

  // Deduplicate
  menuItems = menuItems.filter((v,i,a)=>a.findIndex(t=>(t.path === v.path))===i);

  return (
    <div className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      
      {/* Top Section */}
      <div>
        <div style={{ marginBottom: '64px', position: 'relative' }}>
          <h2 style={{ 
            margin: '0', 
            fontSize: '36px', 
            color: 'var(--text-primary)',
            lineHeight: 1
          }}>
            FieldOps.
          </h2>
          <div style={{ 
            position: 'absolute', 
            top: '-8px', 
            left: '-12px', 
            width: '24px', 
            height: '24px', 
            background: 'var(--primary-color)',
            zIndex: -1,
            mixBlendMode: 'multiply'
          }} />
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '12px 0', 
                  color: isActive ? 'var(--primary-color)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '15px',
                  position: 'relative',
                  transition: 'transform 0.2s ease',
                  transform: isActive ? 'translateX(8px)' : 'none'
                }}
                onMouseEnter={e => {
                  if(!isActive) e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={e => {
                  if(!isActive) e.currentTarget.style.transform = 'none';
                }}
              >
                {isActive && (
                  <div style={{ 
                    position: 'absolute', 
                    left: '-24px', 
                    width: '4px', 
                    height: '100%', 
                    background: 'var(--primary-color)' 
                  }} />
                )}
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', height: '48px', 
            background: 'var(--surface-color)', 
            border: '2px solid var(--border-color)',
            boxShadow: '4px 4px 0px var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '20px', fontFamily: 'var(--font-heading)'
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={toggleTheme}
            className="btn-outline"
            style={{ 
              flex: 1,
              padding: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={onLogout} 
            style={{ 
              flex: 1,
              padding: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'var(--primary-color)',
              color: '#fff',
              boxShadow: '4px 4px 0px var(--border-color)',
              border: '2px solid var(--border-color)'
            }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
