const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    return res.render("error",{
      statusCode,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
  };
  
  
  module.exports = errorHandler;