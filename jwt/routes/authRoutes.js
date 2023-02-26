const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const validateBody = require("../middlewares/bodyValidateMiddleware");
const {
  signUpBodyValidator,
  loginBodyValidator,
} = require("../validators/authValidators");
const verifyJWTRefresh = require("../middlewares/verifyJWTRefresh");

const router = express.Router();

router.post("/", validateBody(signUpBodyValidator), authController.registerUser);

router.post("/login", validateBody(loginBodyValidator), authController.loginUser);

router.get("/logout", authController.logout);

router.get("/refresh", verifyJWTRefresh,authController.refresh);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authController.me
);

module.exports = router;
