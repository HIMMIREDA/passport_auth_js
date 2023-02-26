require("dotenv").config();
const jwt = require("jsonwebtoken");

const issueJWTTokens = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
  };
  const ACCESS_PRIV_KEY = Buffer.from(
    process.env.JWT_ACCESS_TOKEN_PRIV_SECRET,
    "base64"
  ).toString("utf-8");
  const REFRESH_PRIV_KEY = Buffer.from(
    process.env.JWT_REFRESH_TOKEN_PRIV_SECRET,
    "base64"
  ).toString("utf-8");

  const accessToken = jwt.sign(payload, ACCESS_PRIV_KEY, {
    expiresIn: 60 * 60,
    algorithm: "RS256",
  });
  const refreshToken = jwt.sign(payload, REFRESH_PRIV_KEY, {
    expiresIn: 60 * 60 * 24 * 30,
    algorithm: "RS256",
  });

  return {
    accessToken,
    refreshToken,
  };
};


module.exports = {
    issueJWTTokens,
}
