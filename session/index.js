require("dotenv").config();
const dataSource = require("./config/dataSource");
const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require("path");
const session = require("express-session");
const csurf = require("csurf");
const helmet = require("helmet");
const flash = require("connect-flash");
require("./config/passport");
const passport = require("passport");

dataSource
  .initialize()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

// session middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      conString: process.env.POSTGRES_CONSTRING,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));
app.use(csurf());
app.use(require("./middlewares/csrfMiddleware"));

app.use("/", require("./routes/authRoutes"));
app.use("/",require("./routes/resourceRoutes"));

app.use(require("./middlewares/errorHandler"));
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
