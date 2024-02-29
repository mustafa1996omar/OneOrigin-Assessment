import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, Container, Button, Typography, Snackbar, Alert, Grid, TextField, CssBaseline
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#00E60F' },
        secondary: { main: '#1976d2' },
        background: { default: '#f4f4f4' },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h4: { fontWeight: 600 },
        h6: { fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { fontWeight: 500 },
            },
        },
    },
});

function Dashboard() {
    const [workDate, setWorkDate] = useState(new Date());
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleSchedule = async () => {
        if (!startTime || !endTime) {
            setSnackbarMessage('Please select both start and end times.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post('http://localhost:5000/schedule-tasks', {
                date: workDate.toISOString().split('T')[0], // Sending date in YYYY-MM-DD format
                startTime: startTime,
                endTime: endTime,
            });
            setSnackbarMessage('Tasks scheduled successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error scheduling tasks:', error);
            setSnackbarMessage('Failed to schedule tasks.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleGoogleAuth = async () => {

        window.location.href = 'http://localhost:5000/auth/google';

    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Ensures background applies globally */}
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor={theme.palette.background.default}>
                <Container maxWidth="sm" sx={{ py: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">Schedule Tasks</Typography>
                    <Button variant="contained" color="secondary" fullWidth onClick={handleGoogleAuth} sx={{ mb: 3 }}>
                        Connect Google Account
                    </Button>
                    <Typography variant="body1" gutterBottom>
                        Connect your Google account to start scheduling tasks. Select a work date and your available work hours.
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>

                            <Grid item xs={12}>
                                <DatePicker
                                    label="Select Work Date"
                                    value={workDate}
                                    onChange={setWorkDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    label="Work Start Time"
                                    value={startTime}
                                    onChange={setStartTime}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    label="Work End Time"
                                    value={endTime}
                                    onChange={setEndTime}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSchedule} sx={{ mt: 3 }}>
                        Schedule Tasks
                    </Button>
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Dashboard;