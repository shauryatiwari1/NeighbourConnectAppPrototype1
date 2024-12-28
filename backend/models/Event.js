const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: String, required: true },
  location: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;

