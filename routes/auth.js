const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.get('/verify/:token', ctrl.verifyEmail);
router.post('/login', ctrl.login);
router.post('/forgot', ctrl.forgotPassword);
router.post('/reset/:token', ctrl.resetPassword);

module.exports = router;
