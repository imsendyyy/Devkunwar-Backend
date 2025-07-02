const Review = require("../models/Review");

exports.addReview = async (req, res) => {
        try {
                const { name, rating, review, destinationId } = req.body;
                const newReview = new Review({ name, rating, review, destinationId });
                await newReview.save();
                res.status(201).json({ message: 'Review submitted!' });
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
        }
}

exports.getReviewsbyDestination = async (req, res) => {
        try {
                const { destinationId } = req.query;
                const filter = destinationId ? { destinationId } : {};
                const reviews = await Review.find(filter).sort({ createdAt: -1 });
                res.json(reviews);
        } catch (err) {
                res.status(500).json({ message: 'Error loading reviews' });
        }
}