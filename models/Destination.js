const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: String,
    cloudinary_id: String,
    popular: { type: Boolean, default: false },
    guideInfo:  String,        
    thingsToDo: [String],      
    bestTimeToVisit: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', DestinationSchema);
