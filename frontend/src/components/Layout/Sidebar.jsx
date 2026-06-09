import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();

  const staffLinks = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/apply-leave', icon: PlusCircleIcon, label: 'Apply Leave' },
    { to: '/my-leaves', icon: DocumentTextIcon, label: 'My Leaves' },
  ];

  const hodLinks = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/pending-requests', icon: ClipboardDocumentListIcon, label: 'Pending Requests' },
    { to: '/department-leaves', icon: CalendarIcon, label: 'Department Leaves' },
  ];

  const deanLinks = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/pending-requests', icon: ClipboardDocumentListIcon, label: 'Pending Requests' },
    { to: '/faculty-leaves', icon: CalendarIcon, label: 'Faculty Leaves' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/manage-users', icon: UserGroupIcon, label: 'Manage Users' },
    { to: '/reports', icon: ChartBarIcon, label: 'Reports' },
  ];

  let links = [];
  if (user?.role === 'STAFF') links = staffLinks;
  else if (user?.role === 'HOD') links = hodLinks;
  else if (user?.role === 'DEAN') links = deanLinks;
  else if (user?.role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-5 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 my-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;