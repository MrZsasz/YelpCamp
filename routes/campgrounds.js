const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../Models/campground") //importing Models file
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn, isOwner, validateCampground } = require("../middleware");

//***************************************************************************

router.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("Campgrounds/index", { campgrounds });
}))

router.get("/campground/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/add");

})
router.post("/campground/new", isLoggedIn, catchAsync(async (req, res, next) => {
    let { title, location, price, description, image, owner } = req.body;
    // console.log("req.user -> ", req.user._id);
    owner = req.user._id;
    // console.log("Owner -> ",owner);
    const campground = new Campground({ title: title, location: location, price: price, description: description, image: image, owner: owner});
    // console.log("Campground -> ",campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campground/${campground._id}`);
}))

router.get("/campground/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "owner"
            }
        })
        .populate("owner");
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/details", { campground });
}))

router.get("/campground/:id/edit", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findById(id);
    // console.log( campground.title );
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}))
router.post("/campground/:id", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const rb = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title: rb.title, location: rb.location, description: rb.description, price: rb.price, image: rb.image });
    req.flash("success", "Successfully updated a campground!");
    res.redirect(`/campground/${campground._id}`);
}))

router.delete("/campground/:id", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}))

module.exports = router;