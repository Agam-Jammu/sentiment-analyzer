const express = require('express');
const router = express.Router();
const { fetchPosts, searchSubreddit } = require('../controller/reddit');
const axios = require('axios');

router.get('/:subreddit', async (req, res) => {
  const { subreddit } = req.params;
  const { sort = 'hot', time = 'all', limit = 1 } = req.query; // Extract sort, time, and limit from query parameters with defaults

  try {
    // Record the start time for Reddit API call
    const redditStartTime = Date.now();

    // Fetch data from Reddit with the specified sort options
    const data = await fetchPosts(subreddit, sort, time, limit);

    // Record the end time for Reddit API call
    const redditEndTime = Date.now();
    const redditTimeTaken = redditEndTime - redditStartTime;

    console.log(`Reddit API took ${redditTimeTaken} ms`);

    // Define your Python endpoint URL
    const pythonEndpointUrl = 'http://localhost:5000/process';

    // Record the start time for Python endpoint call
    const pythonStartTime = Date.now();

    // Post the data to the Python endpoint
    const pythonResponse = await axios.post(pythonEndpointUrl, { data }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Record the end time for Python endpoint call
    const pythonEndTime = Date.now();
    const pythonTimeTaken = pythonEndTime - pythonStartTime;

    console.log(`Python endpoint took ${pythonTimeTaken} ms`);

    // Send the response from the Python endpoint back to the client
    res.status(200).json({
      success: true,
      data: pythonResponse.data.data, // Access the 'data' field from the Python response
      timing: {
        redditTimeTaken,
        pythonTimeTaken
      }
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

router.get('/:subreddit/search', async (req, res) => {
  const { subreddit } = req.params;
  const { keyword, limit = 1 } = req.query;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: 'Keyword query parameter is required'
    });
  }

  try {
    // Record the start time for Reddit API call
    const redditStartTime = Date.now();

    // Fetch data by searching for the keyword in the subreddit
    const data = await searchSubreddit(subreddit, keyword, limit);

    // Record the end time for Reddit API call
    const redditEndTime = Date.now();
    const redditTimeTaken = redditEndTime - redditStartTime;

    console.log(`Reddit API took ${redditTimeTaken} ms`);

    // Define your Python endpoint URL
    const pythonEndpointUrl = 'http://localhost:5000/process';

    // Record the start time for Python endpoint call
    const pythonStartTime = Date.now();

    // Post the data to the Python endpoint
    const pythonResponse = await axios.post(pythonEndpointUrl, { data }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Record the end time for Python endpoint call
    const pythonEndTime = Date.now();
    const pythonTimeTaken = pythonEndTime - pythonStartTime;

    console.log(`Python endpoint took ${pythonTimeTaken} ms`);

    // Send the response from the Python endpoint back to the client
    res.status(200).json({
      success: true,
      data: pythonResponse.data.data, // Access the 'data' field from the Python response
      timing: {
        redditTimeTaken,
        pythonTimeTaken
      }
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
