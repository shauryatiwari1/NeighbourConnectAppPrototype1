const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 


const newsRoutes = require('./routes/newsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const nearbyUsersRoutes = require('./routes/nearbyUsersRoutes'); 

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error));


app.post('/api/nearby-users', (req, res) => {
  const { latitude, longitude } = req.body;

  
  const users = [
    { id: 1, name: 'Alice', lat: latitude + 0.01, lon: longitude + 0.01 },
    { id: 2, name: 'Bob', lat: latitude - 0.01, lon: longitude - 0.01 },
    { id: 3, name: 'Charlie', lat: latitude + 0.02, lon: longitude - 0.02 },
  ];

  res.json({ users });
});


app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/nearby-users', nearbyUsersRoutes); 


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
