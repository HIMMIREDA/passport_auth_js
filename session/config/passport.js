const passport = require("passport");
const localStrategy = require("passport-local");
const dataSource = require("./dataSource");
const userEntity = require("../entities/userEntity");
const bcrypt = require("bcrypt");

const verifyCallback = (username, password, cb) => {
  const userRepository = dataSource.getRepository(userEntity);

  userRepository
    .findOne({
      where: { username },
    })
    .then((user) => {
      if (!user) {
        return cb(null, false, {
          message: "user with provided credentials is not found",
        });
      }

      bcrypt.compare(password, user.password, (error, matched) => {
        if (error) {
          return cb(error);
        }
        if (!matched) {
          return cb(null, false, {
            message: "username or password is incorrect",
          });
        }
        return cb(null, user);
      });
    })
    .catch((error) => {
      return cb(error);
    });
};

// const customFieldsNames = {
//   username: "username",
//   password: "password",
// };

passport.use(new localStrategy(verifyCallback));

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

passport.deserializeUser((user, done) => {
  const userRepository = dataSource.getRepository(userEntity);
  userRepository
    .findOne({
      where: {
        id: user.id,
      },
      relations: {
        roles: true,
      },
    })
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});
