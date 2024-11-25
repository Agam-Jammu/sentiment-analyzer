const express = require('express');
const router = express.Router();
const { fetchComments } = require('../controller/reddit');
const axios = require('axios'); // Import axios for making HTTP requests

router.get('/:subreddit', async (req, res) => {
  const { subreddit } = req.params;

  try {
    // Fetch data from Reddit
    const data = await fetchComments(subreddit);

    // Define your Python endpoint URL
    const pythonEndpointUrl = 'http://localhost:5000/process'; // Update this to your Python endpoint

    // Post the data to the Python endpoint
    const pythonResponse = await axios.post(pythonEndpointUrl, { data }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Send the response from the Python endpoint back to the client
    res.status(200).json({
      success: true,
      data: pythonResponse.data.data // Access the 'data' field from the Python response
    });

  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        message: 'Python endpoint returned an error',
        error: error.response.data
      });
    } else if (error.request) {
      res.status(500).json({
        success: false,
        message: 'No response received from Python endpoint',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: error.message
      });
    }
  }
});

module.exports = router;
