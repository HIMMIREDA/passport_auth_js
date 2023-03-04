const isAuthenticated = (req,res,next) => {
    if(!req.session.user){
        res.status(401);
        return next(new Error("Unauthorized"));
    }

    return next();

}

module.exports = isAuthenticated;