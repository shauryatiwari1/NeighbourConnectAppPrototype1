import React, { useState, useEffect } from 'react';
import LocationHandler from './components/LocationHandler';
import axios from 'axios';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', location: '', postedBy: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', eventDate: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);  // New state for nearby users
  const [location, setLocation] = useState(null);  // State for current location

  // Fetch news and events from backend when the component mounts
  useEffect(() => {
    // Fetch News
    axios.get('http://localhost:5000/api/news')
      .then((response) => {
        setNews(response.data);  // Update state with the fetched news
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
      });

    // Fetch Events
    axios.get('http://localhost:5000/api/events')
      .then((response) => {
        setEvents(response.data);  // Update state with the fetched events
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  // Fetch location when the app starts (on refresh/restart)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }, []);  // Run only once on mount to fetch location on page load

  // Fetch nearby users when location is available
  useEffect(() => {
    if (location) {
      console.log('Fetching nearby users for location:', location);
      axios.post('http://localhost:5000/api/nearby-users', {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10,  // Set the radius for nearby users in kilometers
      })
        .then((response) => {
          console.log('Nearby users:', response.data.users);
          setNearbyUsers(response.data.users);  // Set nearby users
        })
        .catch((error) => {
          console.error('Error fetching nearby users:', error);
        });
    }
  }, [location]);  // Trigger fetching nearby users only when the location changes

  // Function to handle adding news
  const handleAddNews = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:5000/api/news', newsForm)
      .then((response) => {
        setNews([...news, response.data]);  // Add the newly created news item to the list
        setNewsForm({ title: '', content: '', location: '', postedBy: '' }); // Reset form
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error adding news:', error);
        setLoading(false);
      });
  };

  // Function to handle adding event
  const handleAddEvent = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:5000/api/events', eventForm)
      .then((response) => {
        setEvents([...events, response.data]);  // Add the newly created event to the list
        setEventForm({ title: '', description: '', eventDate: '', location: '' }); // Reset form
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error adding event:', error);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h1>Neighborhood Connect</h1>
      <LocationHandler setLocation={setLocation} />  {/* Pass setLocation to LocationHandler */}

      <div className="content-container">
        {/* News Section */}
        <div className="section-block">
          <h2>Latest News</h2>
          {news.length === 0 ? (
            <p>No news available.</p>
          ) : (
            <ul>
              {news.map((item) => (
                <li key={item._id}>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Posted by:</strong> {item.postedBy || "Unknown User"}</p>
                  <p><strong>Posted At:</strong> {item.postedAt}</p>
                </li>
              ))}
            </ul>
          )}
          {/* Add News Form */}
          <h3>Add News</h3>
          <form onSubmit={handleAddNews}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newsForm.title}
              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
            />
            <textarea
              name="content"
              placeholder="Content"
              value={newsForm.content}
              onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newsForm.location}
              onChange={(e) => setNewsForm({ ...newsForm, location: e.target.value })}
            />
            <input
              type="text"
              name="postedBy"
              placeholder="Posted by (User ID)"
              value={newsForm.postedBy}
              onChange={(e) => setNewsForm({ ...newsForm, postedBy: e.target.value })}
            />
            <button type="submit" disabled={loading}>{loading ? 'Adding News...' : 'Add News'}</button>
          </form>
        </div>

        {/* Events Section */}
        <div className="section-block">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            <ul>
              {events.map((event) => (
                <li key={event._id}>
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.eventDate}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Details:</strong> {event.description}</p>
                </li>
              ))}
            </ul>
          )}
          {/* Add Event Form */}
          <h3>Add Event</h3>
          <form onSubmit={handleAddEvent}>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            />
            <input
              type="text"
              name="eventDate"
              placeholder="Event Date (YYYY-MM-DD)"
              value={eventForm.eventDate}
              onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
            />
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            />
            <button type="submit" disabled={loading}>{loading ? 'Adding Event...' : 'Add Event'}</button>
          </form>
        </div>

        {/* Nearby Users Section */}
        <div className="section-block">
          <h2>Nearby Users</h2>
          {nearbyUsers.length === 0 ? (
            <p>No nearby users found.</p>
          ) : (
            <ul>
              {nearbyUsers.map((user) => (
      <li key={user._id}>
        <h3>{user.name}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Check if location is defined and has coordinates */}
        {user.location && user.location.coordinates ? (
          <p><strong>Location:</strong> {user.location.coordinates.join(', ')}</p>
        ) : (
          <p><strong>Location:</strong> Location data unavailable</p>
        )}
      </li>
    ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
