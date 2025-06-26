const Destination = require('../models/Destination');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Get all destinations (public)
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single destination (public)
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.status(200).json(destination);
  } catch (err) {
    res.status(400).json({ error: 'Invalid destination ID' });
  }
};




// Create destination (admin only)
exports.createDestination = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'devkunwar_destinations' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
        }

        const newDestination = new Destination({
          ...req.body,
          imageUrl: result.secure_url,
          cloudinary_id: result.public_id
        });

        await newDestination.save();
        res.status(201).json({message: "New Destination Created Successfully !",newDestination});
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update destination (admin only)
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });

    let imageUrl = destination.imageUrl;
    let cloudinaryId = destination.cloudinary_id;

    if (req.file) {
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'devkunwar_destinations' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
          }

          imageUrl = result.secure_url;
          cloudinaryId = result.public_id;

          const updated = await Destination.findByIdAndUpdate(
            req.params.id,
            { ...req.body, imageUrl, cloudinary_id: cloudinaryId },
            { new: true }
          );

          res.status(200).json({message:"Your Destination Updated Successfully !",updated});
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      const updated = await Destination.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({message:"Your Destination Updated Successfully !",updated});
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Delete destination (admin only)
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });

    if (destination.cloudinary_id) {
      await cloudinary.uploader.destroy(destination.cloudinary_id);
    }

    await destination.remove();
    res.status(200).json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
