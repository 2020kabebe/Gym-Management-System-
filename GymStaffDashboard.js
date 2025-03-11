import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

function GymStaffDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'gym_staff') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Container 
      maxWidth="md"
      sx={{
        backgroundColor: '#8B4513', // Saddle Brown
        color: '#ffffff', // White text
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        padding: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Gym Staff Dashboard
      </Typography>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#ffffff', color: '#8B4513', fontWeight: 'bold' }}
          component={Link}
          to="/confirm-attendance"
        >
          Confirm Attendance
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: '#ffffff', color: '#8B4513', fontWeight: 'bold' }}
          component={Link}
          to="/view-attendance"
        >
          View Attendance
        </Button>
      </Box>
    </Container>
  );
}

export default GymStaffDashboard;
