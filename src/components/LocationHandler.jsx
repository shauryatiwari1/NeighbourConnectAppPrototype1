import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LocationHandler = () => {
  const [location, setLocation] = useState(null);  // Initialize location state
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [userLocationName, setUserLocationName] = useState('');  // Initialize userLocationName state as an empty string

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

          // Reverse geocoding to get the location name
          axios
            .get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`)
            .then((response) => {
              const result = response.data.results[0];
              if (result) {
                setUserLocationName(result.formatted); // Set the location name if available
              }
            })
            .catch((error) => console.error('Error fetching location name', error));
        },
        (error) => console.error('Error fetching location', error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <h1>Your Location</h1>
      {/* Check if location data is available before rendering */}
      {location ? (
        <p>
          <strong>Coordinates:</strong> {location.latitude}, {location.longitude} <br />
          {/* Check if userLocationName is available before rendering */}
          <strong>Location Name:</strong> {userLocationName ? userLocationName : 'Fetching location...'}
        </p>
      ) : (
        <p>Loading location...</p>  
      )}

      <h2>Nearby Users</h2>
      <ul>
        {nearbyUsers.length > 0 ? (
          nearbyUsers.map((user) => (
            <li key={user.id}>
              {user.name} ({user.lat}, {user.lon})
            </li>
          ))
        ) : (
          <p>No nearby users found.</p>  
        )}
      </ul>
    </div>
  );
};

export default LocationHandler;
