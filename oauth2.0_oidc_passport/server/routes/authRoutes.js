const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const passport = require("passport");
const express = require("express");
const authController = require("../controllers/authController");
const validateBody = require("../middlewares/validateMiddleware");
const { loginBodyValidator } = require("../validators/authValidators");
const isAuthenticated = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/login",
  validateBody(loginBodyValidator),
  authController.loginUser
);

router.get("/logout", isAuthenticated, authController.logout);

router.get("/login/google", passport.authenticate("google"));
router.get("/sessions/oauth/google", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) {
      res.status(401);
      return next(err || new Error("Unauthorized!"));
    }
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
    const state = req.query.state || "/";
    req.login(user, (err) => {
      if (err) {
        res.status(401);
        return next(new Error("Unauthorized!"));
      }
      return res.redirect(FRONTEND_ORIGIN + state);
    });
  })(req, res, next);
});

module.exports = router;
