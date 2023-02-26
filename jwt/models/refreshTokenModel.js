class RefreshToken {
    id;
    refreshToken;
    user;
    constructor(id,refreshToken,user){
        this.id = id;
        this.refreshToken = refreshToken;
        this.user=user;
    }
}


module.exports = RefreshToken;