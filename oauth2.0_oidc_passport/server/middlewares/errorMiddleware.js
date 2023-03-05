require("dotenv").config({
  path: require("path").resolve(__dirname, "/../.env"),
});

const isJsonParsable = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  return res.status(statusCode).json({
    message: isJsonParsable(err.message)
      ? JSON.parse(err.message)
      : err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};

module.exports = errorHandler;
