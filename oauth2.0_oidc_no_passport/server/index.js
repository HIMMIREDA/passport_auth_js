const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });
const session = require("express-session");
const cors = require("cors");
const express = require("express");

const PORT = process.env.PORT || 5000;
const app = express();

require("./config/dataSource")
  .initDb()
  .then(() => {
    app.use('/static', express.static(path.join(__dirname, 'public')))
    app.use(cors({
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true,
    }));
    app.use(express.json());
    app.use(
      session({
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        },
        secret: process.env.SECRET_SESSION_KEY,
        store: new (require("connect-pg-simple")(session))({
          conString: process.env.POSTGRES_CONSTRING,
          createTableIfMissing: true,
        }),
      })
    );
    app.use("/api/auth", require("./routes/authRoutes"));
    
    app.use("/api/users", require("./routes/userRoutes"));

    app.use(require("./middlewares/errorMiddleware"));
    
    app.listen(process.env.PORT, () => {
      console.log(`listening on ${PORT} `);
    });
  })
  .catch((error) => {
    console.log(error);
  });
