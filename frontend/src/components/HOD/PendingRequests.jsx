import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PendingRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      const response = await api.get('/leaves/pending');
      setLeaves(response.data);
    } catch (err) {
      console.error('Error fetching pending leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leaves/approve/${id}`, { comments: comments[id] || '' });
      fetchPendingLeaves();
    } catch (err) {
      alert('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leaves/reject/${id}`, { comments: comments[id] || '' });
      fetchPendingLeaves();
    } catch (err) {
      alert('Failed to reject leave');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Leave Requests</h1>
      
      {leaves.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No pending requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div key={leave.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{leave.user.name}</h3>
                    <span className="text-sm text-gray-500">{leave.user.employeeId}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{leave.user.department}</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Leave Type</p>
                      <p className="font-medium">{leave.leaveType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Days</p>
                      <p className="font-medium">{leave.totalDays} days</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="text-sm">{leave.reason}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Comments</label>
                    <textarea
                      value={comments[leave.id] || ''}
                      onChange={(e) => setComments({ ...comments, [leave.id]: e.target.value })}
                      className="input-field mt-1 text-sm"
                      rows="2"
                      placeholder="Add comments..."
                    />
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(leave.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(leave.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;