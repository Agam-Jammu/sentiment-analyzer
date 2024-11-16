const express = require('express');
const router = express.Router();
const { fetchComments } = require('../controller/reddit');

router.get('/:subreddit', async (req, res) => {
  const { subreddit } = req.params;

  try {
    const data = await fetchComments(subreddit);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching subreddit data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subreddit data',
      error: error.message
    });
  }
});

module.exports = router;
