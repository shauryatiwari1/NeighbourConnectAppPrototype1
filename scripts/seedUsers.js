require('dotenv').config(); 
const mongoose = require('mongoose');
const User = require('../models/user');


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, 
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); //
  });


const baseLatitude = 28.6139;
const baseLongitude = 77.2090;


const generateNearbyCoordinates = (latitude, longitude) => {
  const latitudeOffset = (Math.random() - 0.5) * 0.02; 
  const longitudeOffset = (Math.random() - 0.5) * 0.02; 

  return {
    latitude: latitude + latitudeOffset,
    longitude: longitude + longitudeOffset,
  };
};


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


const seedUsers = async () => {
  try {
   
    await User.deleteMany({});
    console.log('All existing users removed.');

   
    await User.insertMany(users);
    console.log('Users seeded successfully.');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.connection.close();
  }
};


seedUsers();
