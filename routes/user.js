const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const verifyEmail = require('../middleware/verifyEmailMiddleware');
const User = require('../models/User');

router.get('/me', auth, verifyEmail, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
