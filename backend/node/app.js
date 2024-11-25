const express = require('express');
const dotenv = require('dotenv');
const redditRoute = require('./routes/redditRoute');
const dbRoute = require('./routes/dbRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/reddit', redditRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
