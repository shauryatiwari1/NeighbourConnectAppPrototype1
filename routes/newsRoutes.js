const express = require('express');
const News = require('../models/News'); 

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find(); 
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error); 
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});


router.post('/', async (req, res) => {
  
  const { title, content, location, postedBy } = req.body;

 
  if (!title || !content || !location || !postedBy) {
    return res.status(400).json({ message: 'All fields (title, content, location, postedBy) are required.' });
  }


  const news = new News({
    title,
    content,
    location,
    postedBy,
  });

  try {
 
    const newNews = await news.save();
    res.status(201).json(newNews); 
  } catch (error) {
    console.error('Error saving news:', error);  
    res.status(400).json({ message: 'Error saving news', error: error.message });
  }
});

module.exports = router;
