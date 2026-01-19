const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");



// compact route for signup
router.route("/signup")
// Render Signup Form
.get( userController.renderSignupForm )
// Submit signup Form
.post(wrapAsync(userController.signup));


 // compact route for login
 router.route("/login")
 // Render Login Form
 .get(userController.renderLoginForm)
//  Submit login form
 .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.login
);

// logout Route
router.get("/logout", userController.logout);

module.exports = router;