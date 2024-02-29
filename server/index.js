const express = require('express');
const session = require('express-session');
const { oauth2Client, insertGoogleCalendarEvent } = require('./googleAuth');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000', // Configure to match your frontend host
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(express.json());

// Google OAuth Routes
app.get('/auth/google', (req, res) => {
    // Redirect to Google's OAuth 2.0 server
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);
        // Redirect to a page that confirms successful authentication or to your application's main page
        res.redirect('http://localhost:3000/');
    } catch (error) {
        console.error('Error during Google Authentication:', error);
        res.status(500).send('Authentication failed! Please try again.');
    }
});

const mockJiraTasks = [
    { id: 1, key: 'PROJ-123', summary: 'Sample Task 1', estimate: 1 },
    { id: 2, key: 'PROJ-124', summary: 'Sample Task 2', estimate: 2 },
    { id: 3, key: 'PROJ-125', summary: 'Sample Task 3', estimate: 3 },
    { id: 4, key: 'PROJ-126', summary: 'Sample Task 4', estimate: 4 },
    { id: 5, key: 'PROJ-127', summary: 'Sample Task 5', estimate: 5 },
    { id: 6, key: 'PROJ-128', summary: 'Sample Task 6', estimate: 6 },
    { id: 7, key: 'PROJ-129', summary: 'Sample Task 7', estimate: 7 },
    { id: 8, key: 'PROJ-130', summary: 'Sample Task 8', estimate: 8 },
    { id: 9, key: 'PROJ-131', summary: 'Sample Task 9', estimate: 9 },
    { id: 10, key: 'PROJ-132', summary: 'Sample Task 10', estimate: 10 },
];

// Endpoint to fetch mock Jira tasks
app.get('/fetch-mock-tasks', (req, res) => {
    res.json(mockJiraTasks);
});

/**
 * Lists events from a specified Google Calendar within a given time range.
 * 
 * @param {string} calendarId The ID of the calendar to query.
 * @param {google.auth.OAuth2} authClient The authenticated OAuth2 client.
 * @param {Date} timeMin The start time for the events query.
 * @param {Date} timeMax The end time for the events query.
 * @returns {Promise<Array>} A promise that resolves to an array of calendar events.
 */
async function listEvents(calendarId, authClient, timeMin, timeMax) {
    const calendar = google.calendar({version: 'v3', auth: authClient});
    try {
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items; // Returns an array of events
    } catch (error) {
        console.error('The API returned an error: ' + error);
        throw error;
    }
}

// Schedule tasks based on user availability
app.post('/schedule-tasks', async (req, res) => {
    const { date, startTime, endTime } = req.body;
    const startOfDay = new Date(`${date}T${startTime.split('T')[1]}`);
    const endOfDay = new Date(`${date}T${endTime.split('T')[1]}`);


    let existingEvents;
    try {
        existingEvents = await listEvents('primary', oauth2Client, startOfDay, endOfDay);
        console.log(`Fetched ${existingEvents.length} existing events.`);
    } catch (error) {
        console.error('Failed to fetch existing calendar events:', error);
        return res.status(500).send({ message: 'Failed to fetch existing calendar events.', error: error.toString() });
    }

    const tasks = [...mockJiraTasks];
    let currentTime = new Date(startOfDay);
    let scheduledTasks = [];

    for (let task of tasks) {
        let taskEndTime = new Date(currentTime.getTime() + task.estimate * 60 * 60 * 1000);

        if (taskEndTime <= endOfDay) {
            try {
                await insertGoogleCalendarEvent(task, currentTime);
                scheduledTasks.push(task); 
                currentTime = taskEndTime;
            } catch (error) {
                console.error(`Failed to schedule task ${task.key}:`, error);
            }
        }
    }

    // Reference scheduledTasks correctly in the response
    res.send({ message: 'Tasks scheduled successfully.', scheduledTasks }); 
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'An unexpected error occurred',
        message: err.message || 'Internal Server Error',
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
