// routes/gallery.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {
  uploadGalleryImages,
  getAllGalleryImgs,
  deleteGalleryImage,
  getGalleryByDestination
} = require('../controllers/uploadGalleryImage');



// Public
router.get('/getAllImgs', getAllGalleryImgs);
router.get('/destination/:destinationId', getGalleryByDestination);

// Admin
router.post('/upload-to-gallery', auth, upload.array('images', 10), uploadGalleryImages); // max 10 images
router.delete('/delelet/:id', auth, deleteGalleryImage);

module.exports = router;
