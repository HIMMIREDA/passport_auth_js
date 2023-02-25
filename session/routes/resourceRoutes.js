const express = require("express");
const isAuth = require("../middlewares/authMiddleware");
const Role = require("../models/roleModel");
const hasRoles = require("../middlewares/rolesMiddleware");

const router = express.Router();

router.get("/", isAuth, (req, res, next) => {
  return res.render("home", {
    user: { username: req.user?.username, email: req.user.email, roles:req.user?.roles || [] },
  });
});

router.get("/admin", isAuth,hasRoles(Role.ROLES.ADMIN), (req, res, next) => {
  return res.render("admin", {
    user: { username: req.user?.username, email: req.user.email, roles:req.user?.roles || [] },
  });
});



module.exports = router;
