const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Endpoint to get nearby users
router.post('/', async (req, res) => {
  const { latitude, longitude } = req.body;
  const radiusInKm = 10; // Adjust the radius as needed

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Convert radius to radians (Earth's radius is approximately 6378 km)
    const radiusInRadians = radiusInKm / 6378;

    const nearbyUsers = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    });

    res.json({ nearbyUsers });
  } catch (error) {
    console.error('Error finding nearby users:', error);
    res.status(500).json({ error: 'Error finding nearby users' });
  }
});

module.exports = router;
