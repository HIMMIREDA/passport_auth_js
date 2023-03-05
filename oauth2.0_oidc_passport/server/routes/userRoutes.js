const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");

const router = express.Router();
const userController = require("../controllers/userController");
const validateBody = require("../middlewares/validateMiddleware");
const { registerBodyValidator } = require("../validators/authValidators");

router.post(
  "/",
  validateBody(registerBodyValidator),
  userController.registerUser
);

router.get("/me", isAuthenticated, userController.getMe);

module.exports = router;
