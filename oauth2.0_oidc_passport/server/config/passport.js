require("dotenv").config({
  path: require("path").resolve(__dirname + "/.env"),
});
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const localStrategy = require("passport-local");
const dataSource = require("./dataSource");
const userEntity = require("../entities/userEntity");
const bcrypt = require("bcrypt");

const verifyCallbackGoogle = (accessToken, refreshToken, profile, cb) => {
  const userRepository = dataSource.getRepository(userEntity);
  if (!profile._json?.email_verified) {
    return cb(new Error("Sorry your google email is not verified !"));
  }
  userRepository
    .upsert(
      userRepository.create({
        username: profile._json?.name?.replace(" ", "_"),
        email: profile._json?.email,
        password: "",
        provider: "google",
        photo: profile._json?.picture,
      }),
      ["email"]
    )
    .then((savedUser) => {
      if (!savedUser) return cb(null, false);
      return cb(null, { id: savedUser.identifiers[0].id });
    })
    .catch((error) => {
      return cb(error);
    });
};

const verifyCallbackLocal = (req, email, password, done) => {
  const userRepository = dataSource.getRepository(userEntity);
  userRepository
    .findOne({
      where: { email },
    })
    .then((user) => {
      if (!user) {
        return done(new Error("Unauthorized!"));
      }

      if (user.provider === "google") {
        return done(new Error(`Use ${user.provider} Oauth2 to login `));
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(new Error("Password is wrong!"));
      }

      return done(null, {
        id: user.id,
        email: user.email,
        provider: user.provider,
        username: user.username,
        photo: user.photo,
      });
    })
    .catch((error) => {
      return done(error);
    });
};

const customFieldsNames = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.use(new localStrategy(customFieldsNames, verifyCallbackLocal));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state: false,
    },
    verifyCallbackGoogle
  )
);

passport.serializeUser((user, done) => {
  return done(null, {
    id: user.id,
  });
});

passport.deserializeUser((user, done) => {
  const userRepository = dataSource.getRepository(userEntity);
  userRepository
    .findOne({
      where: {
        id: user.id,
      },
    })
    .then((user) => {
      return done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        photo: user.photo,
      });
    })
    .catch((error) => {
      done(error);
    });
});
