import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', location: '', postedBy: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', eventDate: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [location, setLocation] = useState(null);
  const [userLocationName, setUserLocationName] = useState(null); // Add state for location name

  useEffect(() => {
    axios.get('http://localhost:5000/api/news')
      .then((response) => setNews(response.data))
      .catch((error) => console.error('Error fetching news:', error));

    axios.get('http://localhost:5000/api/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Fetch location name using reverse geocoding API
        axios
          .get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9769debf296d40d69585b5d43ce46187`)
          .then((response) => {
            const result = response.data.results[0];
            if (result) {
              setUserLocationName(result.formatted); // Set the location name
            }
          })
          .catch((error) => console.error('Error fetching location name:', error));
      },
      (error) => console.error('Error fetching location:', error)
    );
  }, []);

  useEffect(() => {
    if (location) {
      axios.post('http://localhost:5000/api/nearby-users', {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10,
      })
        .then((response) => setNearbyUsers(response.data.users))
        .catch((error) => console.error('Error fetching nearby users:', error));
    }
  }, [location]);

  const handleAddNews = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:5000/api/news', newsForm)
      .then((response) => {
        setNews([...news, response.data]);
        setNewsForm({ title: '', content: '', location: '', postedBy: '' });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error adding news:', error);
        setLoading(false);
      });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:5000/api/events', eventForm)
      .then((response) => {
        setEvents([...events, response.data]);
        setEventForm({ title: '', description: '', eventDate: '', location: '' });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error adding event:', error);
        setLoading(false);
      });
  };

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Neighborhood Connect</h1>
        <nav>
          <a href="#news" onClick={() => handleScrollToSection('news')}>News</a>
          <a href="#events" onClick={() => handleScrollToSection('events')}>Events</a>
          <a href="#users" onClick={() => handleScrollToSection('users')}>Nearby Users</a>
        </nav>
      </header>

      <h2>Your Location</h2>
      {location ? (
        <p>
          <strong>Coordinates:</strong> {location.latitude}, {location.longitude} <br />
          <strong>Location Name:</strong> {userLocationName || 'Fetching location...'}
        </p>
      ) : (
        <p>Loading location...</p>
      )}

      <div className="main-content">
        <aside className="sidebar">
          <h2>Menu</h2>
          <ul>
            <li><a href="#news" onClick={() => handleScrollToSection('news')}>News</a></li>
            <li><a href="#events" onClick={() => handleScrollToSection('events')}>Events</a></li>
            <li><a href="#users" onClick={() => handleScrollToSection('users')}>Nearby Users</a></li>
          </ul>
        </aside>

        <section className="content">
          <div id="news" className="section-block">
            <h2>Latest News</h2>
            {news.length === 0 ? <p>No news available.</p> : (
              <ul>
                {news.map((item) => (
                  <li key={item._id}>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Posted by:</strong> {item.postedBy || 'Unknown User'}</p>
                    <p><strong>Posted At:</strong> {item.postedAt}</p>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddNews}>
              <input type="text" placeholder="Title" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
              <textarea placeholder="Content" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} />
              <input type="text" placeholder="Location" value={newsForm.location} onChange={(e) => setNewsForm({ ...newsForm, location: e.target.value })} />
              <input type="text" placeholder="Posted by" value={newsForm.postedBy} onChange={(e) => setNewsForm({ ...newsForm, postedBy: e.target.value })} />
              <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add News'}</button>
            </form>
          </div>

          <div id="events" className="section-block">
            <h2>Upcoming Events</h2>
            {events.length === 0 ? <p>No events available.</p> : (
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
            <form onSubmit={handleAddEvent}>
              <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              <textarea placeholder="Event Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              <input type="text" placeholder="Event Date (YYYY-MM-DD)" value={eventForm.eventDate} onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })} />
              <input type="text" placeholder="Event Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
              <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Event'}</button>
            </form>
          </div>

          <div id="users" className="section-block">
            <h2>Nearby Users</h2>
            {nearbyUsers.length === 0 ? <p>No nearby users found.</p> : (
              <ul>
                {nearbyUsers.map((user) => (
                  <li key={user._id}>
                    <h3>{user.name}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.location && user.location.coordinates ? (
                      <p><strong>Location:</strong> {user.location.coordinates.join(', ')}</p>
                    ) : (
                      <p><strong>Location:</strong> Unavailable</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <footer>
        &copy; 2024 Neighborhood Connect. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
