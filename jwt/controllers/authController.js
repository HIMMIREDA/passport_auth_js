require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");
const roleEntity = require("../entities/roleEntity");
const refreshTokenEntity = require("../entities/refreshTokenEntity");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { issueJWTTokens } = require("../utils/tokensUtils");
const RefreshToken = require("../models/refreshTokenModel");

// @desc register user
// @route POST /api/users/
// @access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const userRepository = dataSource.getRepository(userEntity);
  const roleRepository = dataSource.getRepository(roleEntity);
  const refreshTokenRepository = dataSource.getRepository(refreshTokenEntity);

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

  const savedUser = await userRepository.save(
    new User(null, username, email, hpassword, [userRole], [])
  );
  const { accessToken, refreshToken } = issueJWTTokens(savedUser);

  await refreshTokenRepository.save(
    new RefreshToken(null, refreshToken, savedUser)
  );

  res.cookie("refreshToken", refreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  return res.status(201).json({
    accessToken,
  });
});

// @desc login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const userRepository = dataSource.getRepository(userEntity);
  const refreshTokenRepository = dataSource.getRepository(refreshTokenEntity);

  const user = await userRepository.findOne({
    where: {
      username,
    },
    relations: {
      roles: true,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    return next(new Error("Unauthorized."));
  }

  const { accessToken, refreshToken } = issueJWTTokens(user);

  await refreshTokenRepository.save(new RefreshToken(null, refreshToken, user));

  res.cookie("refreshToken", refreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  return res.status(200).json({
    accessToken,
  });
});

// @desc logout user
// @route GET /api/users/logout
// @access private

const logout = asyncHandler(async (req, res, next) => {
  const refreshTokenRepository = dataSource.getRepository(refreshTokenEntity);
  const refreshToken = req.cookies?.refreshToken;
  await refreshTokenRepository
    .createQueryBuilder()
    .delete()
    .from(refreshTokenEntity)
    .where("refreshToken = :refreshToken", { refreshToken })
    .execute();

  res.clearCookie("refreshToken", {
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  return res.status(200).json({
    message: "You have been logged out successfully",
  });
});

// @desc refresh access token
// @route GET /api/users/refresh
// @access private
const refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  const refreshTokenRepository = dataSource.getRepository(refreshTokenEntity);

  const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
    issueJWTTokens(req.user);

  // delete old refresh token
  await refreshTokenRepository.delete({
    refreshToken,
  });
  await refreshTokenRepository.save(
    refreshTokenRepository.create({
      refreshToken: newRefreshToken,
      user: req.user,
    })
  );
  res.cookie("refreshToken", newRefreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  return res.status(200).json({
    accessToken: newAccessToken,
  });
});

const me = (req, res, next) => {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    roles: req.user.roles.map((role) => role.role),
  });
};

module.exports = {
  registerUser,
  logout,
  loginUser,
  refresh,
  me,
};
