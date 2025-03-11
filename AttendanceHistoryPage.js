// src/pages/AttendanceHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchAttendanceHistory } from '../../services/api';
import { formatDate, formatTime } from '../../utils/formatters';

const AttendanceHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    gymId: ''
  });
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Set default date range to last 30 days
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const historyData = await fetchAttendanceHistory({
          startDate,
          endDate
        });
        
        setHistory(historyData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch attendance history:', error);
        setError('Unable to fetch attendance history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const historyData = await fetchAttendanceHistory(filters);
      setHistory(historyData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to apply filters:', error);
      setError('Unable to apply filters');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading attendance history...</div>;

  return (
    <div className="attendance-history-container">
      <h1>Your Gym Attendance History</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="startDate">From:</label>
          <input 
            type="date" 
            id="startDate" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="endDate">To:</label>
          <input 
            type="date" 
            id="endDate" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleFilterChange}
          />
        </div>
        
        <button onClick={applyFilters} className="filter-button">
          Apply Filters
        </button>
      </div>
      
      {history.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Gym</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record.id}>
                <td>{formatDate(record.checkInTime)}</td>
                <td>{formatTime(record.checkInTime)}</td>
                <td>{record.gym?.Gym_name || 'Unknown Gym'}</td>
                <td>{record.isConfirmed ? 'Confirmed' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};

export default AttendanceHistoryPage;