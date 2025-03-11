// src/pages/HomePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { fetchRecentAttendance } from '../../services/api';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  FitnessCenter as GymIcon, 
  History as HistoryIcon, 
  Place as LocationIcon 
} from '@mui/icons-material';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentAttendance = async () => {
      try {
        const data = await fetchRecentAttendance();
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid API response');
        }
        setRecentAttendance(data);
      } catch (error) {
        console.error('Failed to fetch recent attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    getRecentAttendance();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || "Guest"}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Record Gym Visit
              </Typography>
              <Box display="flex" justifyContent="center">
                <GymIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/attendance-record" 
                fullWidth 
                variant="contained"
              >
                Record Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                View History
              </Typography>
              <Box display="flex" justifyContent="center">
                <HistoryIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/attendance-history" 
                fullWidth 
                variant="contained"
              >
                View History
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Find a Gym
              </Typography>
              <Box display="flex" justifyContent="center">
                <LocationIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/gym-locator" 
                fullWidth 
                variant="contained"
              >
                Find Gyms
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        
        {recentAttendance.length > 0 ? (
          <Grid container spacing={2}>
            {recentAttendance.map((activity) => (
              <Grid item xs={12} key={activity.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1">
                      {new Date(activity.date).toLocaleDateString()} at {activity.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.gym?.name} - {activity.gym?.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {activity.confirmed ? 'Confirmed' : 'Pending'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">No recent gym visits found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;
