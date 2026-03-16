
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, User, Download, Users, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: Receipt, label: 'Transactions', path: '/app/transactions' },
    { icon: PieChart, label: 'Analytics', path: '/app/analytics' },
    { icon: Wallet, label: 'Budget', path: '/app/budget' },
    { icon: User, label: 'Profile', path: '/app/profile' },
    { icon: Download, label: 'Export', path: '/app/export' },
    { icon: Users, label: 'Community', path: '/app/community' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Wallet className="logo-icon" size={32} />
        <h1>BudgetWise</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
