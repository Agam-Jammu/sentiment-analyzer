const express = require('express');
const dotenv = require('dotenv');
const redditRoute = require('./routes/redditRoute');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api/reddit', redditRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
