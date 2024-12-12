const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  location: { type: String, required: true },
  postedBy: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
