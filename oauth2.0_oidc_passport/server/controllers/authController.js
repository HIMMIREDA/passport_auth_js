require("dotenv").config({
  path: require("path").resolve(__dirname, "/../.env"),
});
const asyncHandler = require("express-async-handler");
const passport = require("passport");


const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err || ! user) {
      res.status(401);
      return next(err || new Error("Unauthorized"));
    }

    req.login(user, (err) => {
      if (err) {
        res.status(401);
        return next(err);
      }

      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        photo:
          user.provider === "local"
            ? req.protocol + "://" + req.get("host") + "/static/" + user.photo
            : user.photo,
      });
    });
  })(req,res,next);
}


const logout = asyncHandler(async (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    return res.sendStatus(200);
  });
});

module.exports = {
  logout,
  loginUser
};
