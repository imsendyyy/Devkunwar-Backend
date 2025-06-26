const mongoose = require('mongoose')

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  durationDays: Number,
  pricePerPerson: Number,
  isCustomizable: { type: Boolean, default: true },
  image: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', PackageSchema)
