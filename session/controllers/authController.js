const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");
const roleEntity = require("../entities/roleEntity");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const userRepository = dataSource.getRepository(userEntity);
  const roleRepository = dataSource.getRepository(roleEntity);

  const user = await userRepository
    .createQueryBuilder("user")
    .where("user.username = :username", { username })
    .orWhere("user.email = :email", { email })
    .getOne();

  if (user) {
    throw new Error("user with this email or username already exists");
  }
  const hpassword = await bcrypt.hash(password, 10);
  const userRole = await roleRepository.findOne({
    where: { role: Role.ROLES.USER },
  });

  const savedUser = userRepository.save(
    new User(null, username, email, hpassword, [userRole])
  );

  req.login(savedUser, (error) => {
    if (error) {
      return next(error);
    }
    return res.redirect("/");
  });
});

const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
  });
  req.flash("info", "You have been logged out successfully");
  return res.redirect("/login");
};

module.exports = {
  registerUser,
  logout,
};
