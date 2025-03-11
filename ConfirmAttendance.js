import React, { useState } from "react";
import axios from "axios";
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper 
} from '@mui/material';

function ConfirmAttendance() {
  const [attendanceId, setAttendanceId] = useState("");
  const [confirmationTime, setConfirmationTime] = useState("");
  const [message, setMessage] = useState(""); 
  const [status, setStatus] = useState(""); // 'success', 'error', or ''
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setStatus("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in local storage");
      }

      console.log("Sending request to confirm attendance...");
      
      // Make sure the API endpoint is correct - check your backend API base URL
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      
      const response = await axios.post(
        `${baseURL}/attendances/confirm`,
        { attendanceId, confirmationTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response received:", response.data);

      if (response.data && response.data.id) {
        setMessage("Attendance confirmed successfully!");
        setStatus("success");
      } else {
        setMessage("Failed to confirm attendance. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error confirming attendance:", error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          setMessage("API endpoint not found. Please check your server configuration.");
        } else if (error.response.status === 401) {
          setMessage("Authentication failed. Please log in again.");
        } else {
          setMessage(`Server error: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage(`Error: ${error.message}`);
      }
      setStatus("error");
    } finally {
      setLoading(false);
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
        justifyContent: 'center',
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
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#8B4513', fontWeight: 'bold', textAlign: 'center' }}>
          Confirm Attendance
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Attendance ID"
            value={attendanceId}
            onChange={(e) => setAttendanceId(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            type="datetime-local"
            label="Confirmation Time"
            value={confirmationTime}
            onChange={(e) => setConfirmationTime(e.target.value)}
            required
            margin="normal"
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
              mt: 3, 
              mb: 2, 
              backgroundColor: '#8B4513', 
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#6B3000',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm Attendance"}
          </Button>
        </Box>

        {message && (
          <Alert severity={status} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default ConfirmAttendance;