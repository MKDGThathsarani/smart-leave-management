import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { CalendarIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0, balance: {} });
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const leavesRes = await api.get('/leaves/my-leaves');
      const leaves = leavesRes.data;
      
      setStats({
        total: leaves.length,
        pending: leaves.filter(l => l.status === 'PENDING_HOD' || l.status === 'PENDING_DEAN').length,
        approved: leaves.filter(l => l.status === 'APPROVED').length,
      });
      
      setRecentLeaves(leaves.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const statCards = [
    { title: 'Total Applications', value: stats.total, icon: DocumentTextIcon, color: 'bg-blue-500' },
    { title: 'Pending', value: stats.pending, icon: ClockIcon, color: 'bg-yellow-500' },
    { title: 'Approved', value: stats.approved, icon: CheckCircleIcon, color: 'bg-green-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Department: {user?.department}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Recent Applications</h2>
        {recentLeaves.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent applications</p>
        ) : (
          <div className="space-y-3">
            {recentLeaves.map((leave) => (
              <div key={leave.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{leave.leaveType} Leave</p>
                  <p className="text-sm text-gray-500">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  leave.status.includes('PENDING') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {leave.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;