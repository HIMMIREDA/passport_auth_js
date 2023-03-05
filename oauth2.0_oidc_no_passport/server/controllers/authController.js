require("dotenv").config({
  path: require("path").resolve(__dirname, "/../.env"),
});
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");

const { getGoogleOauthToken, verifyIdToken } = require("../utils/googleOauth");

const loginUser = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);
  const { email, password } = req.body;

  const user = await userRepository.findOne({
    where: { email },
  });

  if (!user) {
    res.status(401);
    return next(new Error("Unauthorized!"));
  }

  if (user.provider === "google") {
    res.status(401);
    return next(new Error(`Use ${user.provider} Oauth2 to login `));
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401);
    return next(new Error("Password is wrong!"));
  }

  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.user = {
      id: user.id,
    };
    req.session.save((err) => {
      if (err) return next(err);
      return res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        provider: user.provider,
        photo:
          user.provider === "local"
            ? req.protocol + "://" + req.get("host") + "/static/" + user.photo
            : user.photo,
      });
    });
  });
});

const logout = asyncHandler(async (req, res, next) => {
  req.session.user = null;
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    return res.sendStatus(200);
  });
});

const googleOauthHandler = asyncHandler(async (req, res, next) => {
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
  const code = req.query.code;
  const state = req.query.state || "/";
  const userRepository = dataSource.getRepository(userEntity);

  if (!code) {
    res.status(401);
    return next("Authorization code not provided!");
  }

  // get access_token and id_token
  // i didnt store access token or refresh token bc i dont use the openid provider to get resources after signin the user
  const { access_token, id_token } = await getGoogleOauthToken(code);

  // verify id_token using google pubkey
  const decoded = await verifyIdToken(id_token);

  if (!decoded?.email_verified) {
    res.status(401);
    return next(new Error("Sorry your google email is not verified !"));
  }

  const savedUser = await userRepository.upsert(
    userRepository.create({
      username: decoded?.name?.replace(" ", "_"),
      email: decoded?.email,
      password: "",
      provider: "google",
      photo: decoded?.picture,
    }),
    ["email"]
  );
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.user = {
      id: savedUser.identifiers[0].id,
    };

    req.session.save((err) => {
      if (err) return next(err);
      return res.redirect(FRONTEND_ORIGIN + state);
    });
  });
});

module.exports = {
  googleOauthHandler,
  loginUser,
  logout,
};
