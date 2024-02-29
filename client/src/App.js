import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

function App() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Availability:', startTime, endTime);
    // Here we will later add the logic to send this data to the backend
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>User Availability</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
      </form>
    </Container>
  );
}

export default App;
