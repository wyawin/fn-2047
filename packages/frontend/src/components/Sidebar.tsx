import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitBranch, FileSpreadsheet, Settings } from 'lucide-react';

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'workflows',
    title: 'Workflows',
    icon: GitBranch,
    path: '/workflows'
  },
  {
    id: 'applications',
    title: 'Applications',
    icon: FileSpreadsheet,
    path: '/applications'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-500">
          Finecision
        </h1>
        <p className="text-sm text-gray-500 mt-1">Credit Decision Platform</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}