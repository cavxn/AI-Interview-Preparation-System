import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsedByDefault }) => {
  const [collapsed, setCollapsed] = React.useState(!!collapsedByDefault);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>≡</button>
      <nav className="nav-links">
        <NavLink to="/interview" className="nav-item">🎥 <span>Interview</span></NavLink>
        <NavLink to="/dashboard" className="nav-item">📊 <span>Dashboard</span></NavLink>
        <NavLink to="/settings" className="nav-item">⚙️ <span>Settings</span></NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
