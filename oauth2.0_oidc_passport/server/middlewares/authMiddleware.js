const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    return next(new Error("Unauthorized!"));
  }
};

module.exports = isAuthenticated;
