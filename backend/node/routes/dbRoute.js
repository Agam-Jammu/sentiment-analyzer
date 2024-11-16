const express = require('express');
const router = express.Router();
const writeToDatabase = require('../db/dataWriter'); 

// Route to handle saving data sent by the Python script
router.post('/saveData', async (req, res) => {
  try {
    const { success, data } = req.body;

    if (!success || !data) {
      throw new Error('Invalid data received');
    }

    // Send data to the dataWriter service
    await writeToDatabase(data);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Data saved to database successfully'
    });
  } catch (error) {
    console.error('Error processing received data:', error.message);

    // Respond with an error message
    res.status(500).json({
      success: false,
      message: 'Failed to save data to the database',
      error: error.message
    });
  }
});

module.exports = router;
