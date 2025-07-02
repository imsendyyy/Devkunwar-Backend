const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { inquiryLimiter } = require('../utils/rateLimiters');
const {sendInquiry, getAllInquiry} = require('../controllers/inquiryController')

router.post('/send-inquiry',inquiryLimiter, sendInquiry)
router.get('/get-all-inquiry',auth, getAllInquiry)

module.exports = router;