import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LocationHandler = () => {
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Fetch nearby users
          axios
            .post('http://localhost:5000/api/nearby-users', { latitude, longitude })
            .then((res) => setNearbyUsers(res.data.users))
            .catch((err) => console.error(err));
        },
        (error) => console.error('Error fetching location', error),
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <h1>Your Location</h1>
      {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}

      <h2>Nearby Users</h2>
      <ul>
        {nearbyUsers.map((user) => (
          <li key={user.id}>
            {user.name} ({user.lat}, {user.lon})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationHandler;
