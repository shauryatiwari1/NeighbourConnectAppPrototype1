import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';


const Map = ({ latitude, longitude, nearbyUsers }) => {
  const position = [latitude, longitude]; 

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Your Location</Popup>
        </Marker>
        {nearbyUsers.map((user) => (
          <Marker key={user.id} position={[user.lat, user.lon]}>
            <Popup>{user.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
