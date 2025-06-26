const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');

// Public routes
router.get('/getAllPackages', getAllPackages);
router.get('/getPackage/:id', getPackageById);

// Admin-only routes
router.post('/creatPackage', auth, upload.single('image'), createPackage);
router.put('/updatePackage/:id', auth, upload.single('image'), updatePackage);
router.delete('/deletePackage/:id', auth, deletePackage);

module.exports = router;
