require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const User = require('../models/user');

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if connection fails
  });

// Base location (near New Delhi, India)
const baseLatitude = 28.6139;
const baseLongitude = 77.2090;

// Function to generate nearby coordinates by adding small random offsets
const generateNearbyCoordinates = (latitude, longitude) => {
  const latitudeOffset = (Math.random() - 0.5) * 0.02; // Random value between -0.01 and +0.01
  const longitudeOffset = (Math.random() - 0.5) * 0.02; // Random value between -0.01 and +0.01

  return {
    latitude: latitude + latitudeOffset,
    longitude: longitude + longitudeOffset,
  };
};

// Example users with valid data (generated near the base location)
const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    location: {
      type: 'Point',
      coordinates: [
        generateNearbyCoordinates(baseLatitude, baseLongitude).longitude,
        generateNearbyCoordinates(baseLatitude, baseLongitude).latitude,
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    location: {
      type: 'Point',
      coordinates: [
        generateNearbyCoordinates(baseLatitude, baseLongitude).longitude,
        generateNearbyCoordinates(baseLatitude, baseLongitude).latitude,
      ],
    },
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    location: {
      type: 'Point',
      coordinates: [
        generateNearbyCoordinates(baseLatitude, baseLongitude).longitude,
        generateNearbyCoordinates(baseLatitude, baseLongitude).latitude,
      ],
    },
  },
  {
    name: 'David',
    email: 'david@example.com',
    location: {
      type: 'Point',
      coordinates: [
        generateNearbyCoordinates(baseLatitude, baseLongitude).longitude,
        generateNearbyCoordinates(baseLatitude, baseLongitude).latitude,
      ],
    },
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    location: {
      type: 'Point',
      coordinates: [
        generateNearbyCoordinates(baseLatitude, baseLongitude).longitude,
        generateNearbyCoordinates(baseLatitude, baseLongitude).latitude,
      ],
    },
  },
];

// Seed function
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('All existing users removed.');

    // Insert new users
    await User.insertMany(users);
    console.log('Users seeded successfully.');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedUsers();
