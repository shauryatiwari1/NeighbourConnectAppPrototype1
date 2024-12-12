const express = require('express');
const News = require('../models/News'); // Import News model

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find(); // Retrieve all news from MongoDB
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);  // Log error to server
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

// Post new news
router.post('/', async (req, res) => {
  // Destructure the fields from request body
  const { title, content, location, postedBy } = req.body;

  // Validate if all required fields are provided
  if (!title || !content || !location || !postedBy) {
    return res.status(400).json({ message: 'All fields (title, content, location, postedBy) are required.' });
  }

  // Create a new news object
  const news = new News({
    title,
    content,
    location,
    postedBy,
  });

  try {
    // Save the news item to MongoDB
    const newNews = await news.save();
    res.status(201).json(newNews);  // Send back the created news item
  } catch (error) {
    console.error('Error saving news:', error);  // Log the error
    res.status(400).json({ message: 'Error saving news', error: error.message });
  }
});

module.exports = router;
