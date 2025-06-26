const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');

// Public
router.get('/getAllDestinations', getAllDestinations);
router.get('/getDestination/:id', getDestinationById);

// Admin-only
router.post('/createDestination', auth, upload.single('image'), createDestination);
router.put('/updateDestination/:id', auth, upload.single('image'), updateDestination);
router.delete('/deteleDestination/:id', auth, deleteDestination);

module.exports = router;
