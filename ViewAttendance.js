import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { format } from 'date-fns';

function ViewAttendance() {
  const [gymId, setGymId] = useState('');
  const [date, setDate] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }

      // Make sure the API endpoint is correct - check your backend API base URL
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      
      const response = await axios.get(
        `${baseURL}/attendances/gym/${gymId}/date/${date}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setAttendances(response.data);
      setSuccess(true);
      
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          setError("API endpoint not found. Please check your server configuration.");
        } else if (error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError(`Server error: ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const dateTime = new Date(dateTimeString);
      return format(dateTime, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  return (
    <Container 
      maxWidth="md"
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          backgroundColor: '#ffffff',
          padding: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 700,
          marginBottom: 4
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#8B4513', fontWeight: 'bold', textAlign: 'center' }}>
          View Attendance Records
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Gym ID"
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={loading}
            sx={{ 
              mt: 2, 
              backgroundColor: '#8B4513', 
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#6B3000',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "View Attendance"}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {success && attendances.length > 0 && (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 700, padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#8B4513' }}>
            Attendance Records
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0e6df' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Check-In Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>
                      {attendance.user?.firstName || ''} {attendance.user?.lastName || ''}
                      {!attendance.user && 'Unknown User'}
                    </TableCell>
                    <TableCell>{formatDateTime(attendance.checkInTime)}</TableCell>
                    <TableCell>
                      {attendance.isConfirmed ? 
                        <span style={{ color: 'green' }}>Confirmed</span> : 
                        <span style={{ color: 'orange' }}>Pending</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {success && attendances.length === 0 && (
        <Alert severity="info" sx={{ width: '100%', maxWidth: 700 }}>
          No attendance records found for the selected date and gym.
        </Alert>
      )}
    </Container>
  );
}

export default ViewAttendance;