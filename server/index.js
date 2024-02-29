// server/index.js
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
