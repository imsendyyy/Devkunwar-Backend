
const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
  images: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  caption: String,
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination', // Link to Destination
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);
