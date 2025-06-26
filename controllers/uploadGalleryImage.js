// controllers/galleryController.js
const GalleryImage = require('../models/GalleryImage');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadGalleryImages = async (req, res) => {
  try {
    const { destination, caption } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    if (!destination) {
      return res.status(400).json({ error: 'Destination ID is required' });
    }

    const uploadedImages = [];

    await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'devkunwar_gallery' },
            async (error, result) => {
              if (error) return reject(error);

              const newImage = new GalleryImage({
                images: result.secure_url,
                cloudinary_id: result.public_id,
                caption: caption || '',
                destination
              });

              await newImage.save();
              uploadedImages.push(newImage);
              resolve();
            }
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      })
    );

    res.status(201).json({
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      images: uploadedImages
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


exports.deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinary_id);

    // Delete from MongoDB
    await image.deleteOne(); // ✅ modern Mongoose way

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


// Public for Get Img By Destination
exports.getGalleryByDestination = async (req, res) => {
  try {
    const images = await GalleryImage.find({ destination: req.params.destinationId });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Public for all Gallary Imgs 
exports.getAllGalleryImgs = async(req, res) => {
    try {
        const Gallary = await GalleryImage.find();
        res.status(200).json(Gallary);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

