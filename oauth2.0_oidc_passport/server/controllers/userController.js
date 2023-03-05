const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);
  const { email, username, password } = req.body;

  const user = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (user) {
    res.status(401);
    return next(new Error(`A user with ${email} already exists`));
  }

  const savedUser = await userRepository.save(
    new User(null, username, email, bcrypt.hashSync(password, 10), "local")
  );
  req.login(savedUser,(err) => {
    if (err) return next(err);
    return res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      provider: savedUser.provider,
      photo:
        savedUser.provider === "local"
          ? req.protocol +
            "://" +
            req.get("host") +
            "/static/" +
            savedUser.photo
          : savedUser.photo,
    });
  });
});

const getMe = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    username: req.user.username,
    email: req.user.email,
    photo:
      req.user.provider === "local"
        ? req.protocol + "://" + req.get("host") + "/static/" + req.user.photo
        : req.user.photo,
    provider: req.user.provider,
  });
});

module.exports = {
  registerUser,
  getMe,
};
