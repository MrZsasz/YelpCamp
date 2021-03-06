const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
})
router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
})
router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    req.flash("success", "Welcome!");
    const redirectUrl = req.session.retrunTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
})

module.exports = router;