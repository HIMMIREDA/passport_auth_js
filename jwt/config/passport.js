require("dotenv").config();
const dataSource = require("./dataSource");
const userEntity = require("../entities/userEntity");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const configPassport = (passport) => {
  const ACCESS_PUB_KEY = Buffer.from(process.env.JWT_ACCESS_TOKEN_PUB_SECRET,"base64").toString("utf-8");
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = ACCESS_PUB_KEY;
  opts.algorithms = ["RS256"];

  const verifyCallback = (jwt_payload, done) => {
    const userRepository = dataSource.getRepository(userEntity);
    userRepository
      .findOne({
        where: {
          id: jwt_payload.id,
        },
        relations: {
          roles: true,
        },
      })
      .then((user) => {
        if (!user)
          return done(null, false, {
            message: "No user found with those credentials !",
          });
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  };

  passport.use(new JwtStrategy(opts, verifyCallback));
};



module.exports = configPassport;
