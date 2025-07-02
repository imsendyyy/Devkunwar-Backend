const rateLimit = require('express-rate-limit');

// Limit: max 2 requests per 10 minutes per IP
const inquiryLimiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 2,
        message: 'Too many inquiries from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
});

// Limit: max 3 reviews per hour per IP
const reviewLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3,
        message: 'You have submitted too many reviews recently. Please slow down.',
        standardHeaders: true,
        legacyHeaders: false,
});

module.exports = {
        inquiryLimiter,
        reviewLimiter,
};
