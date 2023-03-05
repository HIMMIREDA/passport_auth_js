const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

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


// redirection will be done in the client side
// router.get("/oauth/google", (req, res, next) => {
//   const state = req.url;
//   const scopes = ["openid", "profile", "email"];
//   // add these query paramaters if you want to refresh the access token: &prompt=consent&access_type=offline
//   res.redirect(
//     `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${
//       process.env.GOOGLE_OAUTH_CLIENT_ID
//     }&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URL}&scope=${scopes.join(
//       " "
//     )}&state=${state}`
//   );
// });

router.get("/sessions/oauth/google", authController.googleOauthHandler);

module.exports = router;
