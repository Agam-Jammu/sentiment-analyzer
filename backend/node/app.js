const express = require('express');
const dotenv = require('dotenv');
const redditRoute = require('./routes/redditRoute');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: ['http://localhost:3000'], // Replace with actual domains
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// Routes
app.use('/api/reddit', redditRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
