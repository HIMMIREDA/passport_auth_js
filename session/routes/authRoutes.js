const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const isAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/login")
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      successReturnToOrRedirect: "/",
    })
  )
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
  
    res.render("login", { errorMessages: req.flash("error") || [],infoMessages: req.flash("info") || [] });
  });

router
  .route("/register")
  .post(authController.registerUser)
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("register");
  });

router.get("/logout", isAuth, authController.logout);
module.exports = router;
