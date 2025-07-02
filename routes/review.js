const express = require("express");
const router = express.Router()
const { reviewLimiter } = require('../utils/rateLimiters');
const { addReview, getReviewsbyDestination} = require('../controllers/reviewController')


router.post('/addNewReview', reviewLimiter, addReview);
router.get('/getAllReviews',getReviewsbyDestination);

module.exports = router;