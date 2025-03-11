// src/pages/GymLocatorPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchGyms } from '../../services/api';

const GymLocatorPage = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        const gymsList = await fetchGyms();
        setGyms(gymsList);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch gyms:', err);
        setError('Unable to load gyms');
        setLoading(false);
      }
    };

    loadGyms();
  }, []);

  const filteredGyms = gyms.filter(gym => 
    gym.Gym_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.Location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading gyms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gym-locator-container">
      <h1>Gym Locator</h1>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search gyms by name or location" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="gyms-table">
        <thead>
          <tr>
            <th>Gym Name</th>
            <th>Location</th>
            <th>Opening Hours</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {filteredGyms.map(gym => (
            <tr key={gym.id}>
              <td>{gym.Gym_name}</td>
              <td>{gym.Location}</td>
              <td>{gym.Opening_Hours}</td>
              <td>
                {gym.Phone_number || 'N/A'}
                <br />
                {gym.Email || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredGyms.length === 0 && (
        <p>No gyms found matching your search.</p>
      )}
    </div>
  );
};

export default GymLocatorPage;