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
  MapPin
} from 'lucide-react';

function Sidebar({ onLogout, user }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <ListTodo size={20} /> },
  ];

  if (user && user.role === 'ADMIN') {
    menuItems.push(
      { name: 'Users', path: '/users', icon: <UserIcon size={20} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} /> },
      { name: 'Regions', path: '/regions', icon: <MapIcon size={20} /> },
      { name: 'Teams', path: '/teams', icon: <UsersIcon size={20} /> },
      { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> }
    );
  } else if (user && user.role === 'TEAM_LEAD') {
    menuItems.push(
      { name: 'My Team', path: '/my-team', icon: <UsersIcon size={20} /> },
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} /> }
    );
  } else if (user && user.role === 'AUDITOR') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} /> }
    );
  } else if (user && user.role === 'REGIONAL_MANAGER') {
    menuItems.push(
      { name: 'Visits', path: '/visits', icon: <MapPin size={20} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
      { name: 'Activity Logs', path: '/logs', icon: <ClipboardList size={20} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} /> }
    );
  } else {
    // Field Agents
    menuItems.push(
      { name: 'My Tasks', path: '/tasks', icon: <ListTodo size={20} /> },
      { name: 'My Visits', path: '/visits', icon: <MapPin size={20} /> },
      { name: 'Profile', path: '/settings', icon: <UserIcon size={20} /> }
    );
  }

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#646cff' }}>FieldOps</h2>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
           <UserIcon size={14} style={{ marginRight: '5px' }} />
           {user.username} ({user.role || 'User'})
        </div>
      </div>
      
      <nav>
        {menuItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px', 
              color: location.pathname === item.path ? '#646cff' : '#ccc',
              textDecoration: 'none',
              borderRadius: '4px',
              background: location.pathname === item.path ? '#2a2a2a' : 'transparent',
              marginBottom: '5px'
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button 
          onClick={onLogout} 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            background: '#333'
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
