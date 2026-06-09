import React, { useState } from 'react';
import api from '../../services/api';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: 'CASUAL', label: 'Casual Leave', days: 12 },
    { value: 'SICK', label: 'Sick Leave', days: 10 },
    { value: 'ANNUAL', label: 'Annual Leave', days: 15 },
    { value: 'STUDY', label: 'Study Leave', days: 'Special' },
    { value: 'WITHOUT_PAY', label: 'Without Pay', days: 'Unpaid' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.post('/leaves/apply', formData);
      setMessage({ type: 'success', text: 'Leave application submitted successfully!' });
      setFormData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply leave' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h1>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-5">
          <div>
            <label className="label">Leave Type</label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="input-field"
            >
              {leaveTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.days !== 'Special' && type.days !== 'Unpaid' && `(${type.days} days/year)`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="label">Reason</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows="4"
              className="input-field"
              placeholder="Please provide reason for leave..."
              required
            />
          </div>
          
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;