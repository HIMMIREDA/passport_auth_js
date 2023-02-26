require("dotenv").config();
const dataSource = require("./config/dataSource");
dataSource.initDb();
const express = require("express");
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const configPassport = require("./config/passport");


const app = express();

app.use(require("helmet")());
app.use(express.json());
app.use(require("cookie-parser")());

// config jwt passport strategy
configPassport(passport);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth",require("./routes/authRoutes"));

app.use(require("./middlewares/errorHandler"));
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
