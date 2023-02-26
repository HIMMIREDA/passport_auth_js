const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const hasRoles = require("../middlewares/rolesMiddleware");
const Role = require("../models/roleModel");
const validateBody = require("../middlewares/bodyValidateMiddleware");
const validateParams = require("../middlewares/paramsValidateMiddleware");
const {
  userParamsValidator,
  updateUserBodyValidator,
} = require("../validators/userValidators");

// those routes need to be authenticated and  an admin (dashboard)
router.use(
  passport.authenticate("jwt", { session: false }),
  hasRoles(Role.ROLES.ADMIN)
);

router.get("/", userController.getUsers);

router
  .route("/:id")
  .all(validateParams(userParamsValidator))
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .put(validateBody(updateUserBodyValidator), userController.updateUser);

module.exports = router;
