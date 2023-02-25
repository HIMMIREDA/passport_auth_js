const hasRoles = (...allowedRoles) => {
    return (req,res,next) => {
        const userRoles = (req.user?.roles || []).map((roleObj) => roleObj.role);
        
        const allowed = allowedRoles.every(role => userRoles.includes(role));
        if(!allowed){
            res.status(403);
            return next(new Error("you are Forbidden to view this page"))
        }

        next();
    }
}

module.exports = hasRoles;