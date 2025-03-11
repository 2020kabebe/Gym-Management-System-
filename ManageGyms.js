import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Place as PlaceIcon
} from '@mui/icons-material';

const ManageGyms = () => {
    const [gyms, setGyms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingGym, setEditingGym] = useState(null);
    const [formData, setFormData] = useState({
        Gym_name: '',
        Location: '',
        membership_fees: '',
        facilities: '',
        Opening_Hours: '',
        Phone_number: '',
        Email: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch gyms when component mounts
    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        setIsLoading(true);
        try {
            // Add token validation
            const token = localStorage.getItem('token');
            if (!token) {
                setSnackbar({
                    open: true,
                    message: 'Authentication token is missing. Please log in again.',
                    severity: 'error'
                });
                setIsLoading(false); // Ensure loading is set to false even if token is missing
                return;
            }
            console.log("Fetching gyms with token:", token.substring(0, 15) + "..."); // Debugging

            // Replace with your actual API endpoint.  `/gyms` is the standard endpoint for GET
            const response = await fetch('http://localhost:3000/gyms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Improved error handling
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching gyms:", response.status, errorText);

                if (response.status === 401) {
                    throw new Error('Unauthorized: You may need to log in again');
                } else {
                    throw new Error('Failed to fetch gyms');
                }
            }

            const data = await response.json();
            setGyms(data);
        } catch (error) {
            console.error('Error fetching gyms:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to load gyms. Please try again.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (gym = null) => {
        if (gym) {
            setEditingGym(gym);
            setFormData({
                Gym_name: gym.Gym_name,
                Location: gym.Location,
                membership_fees: gym.membership_fees.toString(),
                facilities: gym.facilities || '',
                Opening_Hours: gym.Opening_Hours,
                Phone_number: gym.Phone_number || '',
                Email: gym.Email || '',
                isActive: gym.isActive
            });
        } else {
            setEditingGym(null);
            setFormData({
                Gym_name: '',
                Location: '',
                membership_fees: '',
                facilities: '',
                Opening_Hours: '',
                Phone_number: '',
                Email: '',
                isActive: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Gym_name?.trim()) newErrors.Gym_name = 'Gym name is required';
        if (!formData.Location?.trim()) newErrors.Location = 'Location is required';
        if (!formData.membership_fees) {
            newErrors.membership_fees = 'Membership fees is required';
        } else if (isNaN(formData.membership_fees) || parseFloat(formData.membership_fees) <= 0) {
            newErrors.membership_fees = 'Membership fees must be a positive number';
        }
        if (!formData.Opening_Hours?.trim()) newErrors.Opening_Hours = 'Opening Hours is required';
        return newErrors;
    };

    const handleSubmit = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Add this to check token
        const token = localStorage.getItem('token');
        console.log('tokennnnn',token);
        if (!token) {
            setSnackbar({
                open: true,
                message: 'Authentication token is missing. Please log in again.',
                severity: 'error'
            });
            return;
        }
        console.log("Using token:", token.substring(0, 15) + "..."); // Show first part of token for debugging... setIsLoading(true);
        setIsLoading(true);
        try {
            const url = editingGym
                ? `http://localhost:3000/gyms/${editingGym.id}`
                : 'http://localhost:3000/gyms/';

            const method = editingGym ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                membership_fees: parseFloat(formData.membership_fees),
                isActive: formData.isActive
            };
            if (formData.facilities === '') {
                delete payload.facilities;
            }
            if (formData.Phone_number === '') {
                delete payload.Phone_number;
            }
            if (formData.Email === '') {
                delete payload.Email;
            }

            // Log request details for debugging
            console.log("Sending request to:", url);
            console.log("With method:", method);
            console.log("With payload:", payload);
            console.log("token",token);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            // Improved error handling
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", response.status, errorText);

                if (response.status === 401) {
                    throw new Error('Unauthorized: You may not have admin permissions or need to log in again');
                } else if (response.status === 403) {
                    throw new Error('Forbidden: You do not have permission to perform this action');
                } else {
                    throw new Error(editingGym ? 'Failed to update gym' : 'Failed to create gym');
                }
            }
            // Refresh the gym list
            await fetchGyms();

            setSnackbar({
                open: true,
                message: editingGym ? 'Gym updated successfully!' : 'Gym added successfully!',
                severity: 'success'
            });

            handleCloseDialog();
        } catch (error) {
            console.error('Error saving gym:', error);
            setSnackbar({
                open: true,
                message: error.message,
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGym = async (gymId) => {
        if (!window.confirm('Are you sure you want to delete this gym?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setSnackbar({
                    open: true,
                    message: 'Authentication token is missing. Please log in again.',
                    severity: 'error'
                });
                return;
            }

            const response = await fetch(`http://localhost:3000/gyms/${gymId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete gym');
            }

            // Refresh the gym list
            await fetchGyms();

            setSnackbar({
                open: true,
                message: 'Gym deleted successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting gym:', error);
            setSnackbar({
                open: true,
                message: error.message,
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: '#8B4513', fontWeight: 'bold' }}>
                    Manage Gyms
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: '#8B4513',
                        '&:hover': { bgcolor: '#6B3E11' }
                    }}
                >
                    Add New Gym
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 4, bgcolor: '#FFF8DC' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#F5F5DC' }}>
                            <TableCell><Typography fontWeight="bold">Gym Name</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Location</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Membership Fees</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Facilities</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Opening Hours</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Phone Number</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                            <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gyms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    {isLoading ? 'Loading gyms...' : 'No gyms found. Add a new gym to get started.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            gyms.map((gym) => (
                                <TableRow key={gym.id}>
                                    <TableCell>{gym.Gym_name}</TableCell>
                                    <TableCell>{gym.Location}</TableCell>
                                    <TableCell>{gym.membership_fees}</TableCell>
                                    <TableCell>{gym.facilities}</TableCell>
                                    <TableCell>{gym.Opening_Hours}</TableCell>
                                    <TableCell>{gym.Phone_number}</TableCell>
                                    <TableCell>{gym.Email}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                bgcolor: gym.isActive ? '#E6FFE6' : '#FFE6E6',
                                                color: gym.isActive ? 'green' : 'red',
                                                py: 0.5,
                                                px: 1,
                                                borderRadius: 1,
                                                display: 'inline-block'
                                            }}
                                        >
                                            {gym.isActive ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog(gym)}
                                            title="Edit Gym"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteGym(gym.id)}
                                            title="Delete Gym"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>... {/* Add/Edit Gym Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#F5F5DC' }}>
                    {editingGym ? 'Edit Gym' : 'Add New Gym'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="Gym_name"
                                label="Gym Name"
                                value={formData.Gym_name}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.Gym_name}
                                helperText={errors.Gym_name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="Location"
                                label="Location"
                                value={formData.Location}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.Location}
                                helperText={errors.Location}
                                InputProps={{
                                    startAdornment: <PlaceIcon sx={{ mr: 1, color: '#8B4513' }} />
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="membership_fees"
                                label="Membership Fees"
                                type="number"
                                value={formData.membership_fees}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.membership_fees}
                                helperText={errors.membership_fees}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="Opening_Hours"
                                label="Opening Hours"
                                value={formData.Opening_Hours}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.Opening_Hours}
                                helperText={errors.Opening_Hours}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="facilities"
                                label="Facilities"
                                value={formData.facilities || ''}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="Phone_number"
                                label="Phone Number"
                                value={formData.Phone_number || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="Email"
                                label="Email"
                                value={formData.Email || ''}
                                onChange={handleChange}
                                fullWidth
                                type="email"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: '#8B4513', '&:hover': { bgcolor: '#6B3E11' } }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Gym'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageGyms;
