import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const roles = {
      ADMIN: 'bg-purple-100 text-purple-800',
      HOD: 'bg-blue-100 text-blue-800',
      DEAN: 'bg-green-100 text-green-800',
      STAFF: 'bg-gray-100 text-gray-800'
    };
    return roles[user?.role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary-600">
            Smart Leave Management System
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-700">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge()}`}>
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;