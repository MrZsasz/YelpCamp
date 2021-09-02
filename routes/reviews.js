const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../Models/campground") //importing Models file
const Review = require("../Models/review");

const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");

const { isLoggedIn, isReviewOwner } = require("../middleware");

//******************************************************************

// const { reviewSchema } = require("../schemas.js");

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

router.post("/campground/:id/reviews", isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campground/${campground._id}`);
}))

router.delete("/campground/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/campground/${id}`);
}))

module.exports = router;