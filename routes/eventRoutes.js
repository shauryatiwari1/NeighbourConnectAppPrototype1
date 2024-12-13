const express = require('express');
const Event = require('../models/Event');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const events = await Event.find(); 
    res.json(events); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  const { title, description, eventDate, location } = req.body;

  
  const event = new Event({
    title,
    description,
    eventDate,
    location
  });

  try {
    const newEvent = await event.save(); 
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
});

module.exports = router;
