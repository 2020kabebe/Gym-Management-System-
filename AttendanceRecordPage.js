// src/pages/AttendanceRecordPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchGyms, recordAttendance } from '../../services/api';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { fetchGyms, recordAttendance } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';


const AttendanceRecordPage = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    gymId: '',
    date: new Date(),
    time: new Date()
  });

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const data = await fetchGyms();
        setGyms(data);
        console.log(gyms);
      } catch (error) {
        console.error('Failed to fetch gyms:', error);
        setError('Failed to load gyms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, []);

  const handleGymChange = (event) => {
    setFormData(prev => ({ ...prev, gymId: event.target.value }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({ ...prev, date: newDate }));
  };

  const handleTimeChange = (newTime) => {
    setFormData(prev => ({ ...prev, time: newTime }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Format the date and time for the API
      const formattedData = {
        gymId: formData.gymId,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time.toTimeString().split(' ')[0].slice(0, 5)
      };
      
      await recordAttendance(formattedData);
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        gymId: '',
        date: new Date(),
        time: new Date()
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to record attendance:', error);
      setError('Failed to record attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Record Gym Visit
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Attendance recorded successfully!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="gym-select-label">Select Gym</InputLabel>
            <Select
              labelId="gym-select-label"
              id="gym-select"
              value={formData.gymId}
              label="Select Gym"
              onChange={handleGymChange}
              required
            >
              {gyms.map(gym => (
                <MenuItem key={gym.id} value={gym.id}>
                  {gym.Gym_name} - {gym.location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TimePicker
                label="Time"
                value={formData.time}
                onChange={handleTimeChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Recording...' : 'Record Visit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AttendanceRecordPage;