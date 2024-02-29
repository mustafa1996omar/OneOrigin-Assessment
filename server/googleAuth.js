require('dotenv').config();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL
);

// Scopes for Google Calendar API
const scopes = [
    'https://www.googleapis.com/auth/calendar',
];

// Generate a URL that asks permissions for the Calendar scope
const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});

/**
 * Inserts a new event into Google Calendar based on a provided task object.
 * 
 * @param {Object} task The task object to schedule as an event.
 * @param {Date} startDateTime The start date and time for the event.
 * @returns {Promise<Object>} A promise that resolves to the created calendar event.
 */
async function insertGoogleCalendarEvent(task, startDateTime) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Calculate the end time based on the task estimate
    let endTime = new Date(startDateTime);
    endTime.setHours(endTime.getHours() + task.estimate);

    const event = {
        summary: task.summary,
        description: `Jira Task: ${task.key} - Estimated Hours: ${task.estimate}`,
        start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'America/New_York', // Adjust according to your timezone
        },
        end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/New_York',
        },
    };

    try {
        const { data } = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        console.log(`Event created: ${data.htmlLink}`);
        return data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error; // Rethrow the error for further handling

    }
}


module.exports = { insertGoogleCalendarEvent, oauth2Client };
