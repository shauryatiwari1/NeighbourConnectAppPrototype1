const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const newsRoutes = require('./routes/newsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const nearbyUsersRoutes = require('./routes/nearbyUsersRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/nearby-users', nearbyUsersRoutes);

// Serve static files from React's build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Serve the index.html for non-API requests
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  } else {
    res.status(404).send('API route not found');
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
