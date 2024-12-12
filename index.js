const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Import the routes
const newsRoutes = require('./routes/newsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const nearbyUsersRoutes = require('./routes/nearbyUsersRoutes'); 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Example API to get nearby users based on lat/lon
app.post('/api/nearby-users', (req, res) => {
  const { latitude, longitude } = req.body;

  // Hardcoded user data - replace this with database queries if needed
  const users = [
    { id: 1, name: 'Alice', lat: latitude + 0.01, lon: longitude + 0.01 },
    { id: 2, name: 'Bob', lat: latitude - 0.01, lon: longitude - 0.01 },
    { id: 3, name: 'Charlie', lat: latitude + 0.02, lon: longitude - 0.02 },
  ];

  res.json({ users });
});

// Use the news and event routes
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/nearby-users', nearbyUsersRoutes); 

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
