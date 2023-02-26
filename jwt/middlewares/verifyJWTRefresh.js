require("dotenv").config();
const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const jwt = require("jsonwebtoken");
const userEntity = require("../entities/userEntity");
const refreshTokenEntity = require("../entities/refreshTokenEntity");

const verifyJWTRefresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401);
    return next(new Error("Refresh token missing"));
  }

  try {
    const JWT_PUB_SECRET = Buffer.from(
      process.env.JWT_REFRESH_TOKEN_PUB_SECRET,
      "base64"
    ).toString("utf-8");
    const payload = jwt.verify(refreshToken, JWT_PUB_SECRET, {
      algorithms: ["RS256"],
    });

    const userRepository = dataSource.getRepository(userEntity);
    const user = await userRepository.findOne({
      where: { id: payload.id },
      relations: {
        roles: true,
        refreshTokens: true,
      },
    });
    if (!user) {
      res.status(401);
      return next(new Error("Invalid refresh token"));
    }

    const refreshTokenRepository = dataSource.getRepository(refreshTokenEntity);
    const token = await refreshTokenRepository.findOne({
      where: { refreshToken, user },
    });

    if (!token) {
      res.status(401);
      return next(new Error("Invalid refresh token"));
    }

    req.user = user;
    return next();
  } catch (err) {
    res.status(401);
    return next(new Error("Invalid refresh token"));
  }
});

module.exports = verifyJWTRefresh;
