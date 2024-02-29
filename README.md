# Setup & Launch Instructions

## Clone and Configure:
1. **Clone the repository:** `git clone <repository-url>`
2. **Navigate to the `server` directory:** 

    `cd server`

3. **Create a `.env` file with your Google OAuth credentials and session secret:**

    ```plaintext
    GOOGLE_CLIENT_ID="your-client-id"
    GOOGLE_CLIENT_SECRET="your-client-secret"
    CALLBACK_URL="http://localhost:5000/auth/google/callback"
    SESSION_SECRET="your-session-secret"```
## Start Server:

1. **Install dependencies:**
    
    `npm i`
2. **Run the server:**

    `node index.js`

## Start Client:
1. **In a new terminal, navigate to the client directory:**

    `cd ../client`

2. **Install dependencies:**

    `npm i`

3. **Launch the client application:**

    `npm start`



## Usage Instructions

- After starting both the server and client applications, your default web browser should automatically open to the client application running at http://localhost:3000.
- If the browser does not open automatically, manually navigate to http://localhost:3000.
- On the Dashboard page, you'll be prompted to connect your Google account for calendar integration. Click the "Connect Google Account" button to authenticate.
Once authenticated, you can select a work date, start time, and end time to schedule your tasks.
- Click the "Schedule Tasks" button to add the tasks to your Google Calendar based on the selected times.
- Open the Google Calendar page and view your scheduled tasks.