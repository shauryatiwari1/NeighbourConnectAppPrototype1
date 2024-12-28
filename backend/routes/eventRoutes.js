const express = require('express');
const Event = require('../models/Event'); // Import the Event model

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find(); // Retrieve all events from MongoDB
    res.json(events); // Send the events as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post new event
router.post('/', async (req, res) => {
  const { title, description, eventDate, location } = req.body;

  // Create a new event, eventDate is treated as a string
  const event = new Event({
    title,
    description,
    eventDate, // Keep eventDate as a string
    location
  });

  try {
    const newEvent = await event.save(); // Save the event to MongoDB
    res.status(201).json(newEvent); // Return the created event
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle error during save
  }
});

module.exports = router;
