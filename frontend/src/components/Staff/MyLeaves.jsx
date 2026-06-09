import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leaves/my-leaves');
      setLeaves(response.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING_HOD: 'bg-yellow-100 text-yellow-800',
      PENDING_DEAN: 'bg-orange-100 text-orange-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING_HOD: 'Pending (HOD)',
      PENDING_DEAN: 'Pending (Dean)',
      APPROVED: 'Approved',
      REJECTED: 'Rejected'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Leave Applications</h1>
      
      {leaves.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No leave applications found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{leave.totalDays}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(leave.appliedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;