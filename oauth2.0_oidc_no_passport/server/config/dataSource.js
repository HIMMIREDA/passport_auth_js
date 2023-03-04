const { DataSource } = require("typeorm");
require("dotenv").config({
  path: require("path").resolve(__dirname + "/../.env"),
});

const bcrypt = require("bcrypt");
const userEntity = require("../entities/userEntity");
const User = require("../models/userModel");

console.log(process.env.POSTGRES_USERNAME);
const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: "mysecret",
  database: process.env.POSTGRES_DATABASENAME,
  synchronize: true,
  logging: true,
  dropSchema: true,
  entities: [__dirname + "/../entities/*{.js,.ts}"],
  subscribers: [],
  migrations: [],
});

dataSource.initDb = function () {
  return this.initialize()
    .then(() => {
      let user1 = new User(
        1,
        "reda",
        "reda@gmail.com",
        bcrypt.hashSync("Pickford10$", 10),
        "local",
        "default.png"
      );
      let user2 = new User(
        2,
        "wafaa",
        "wafaa@gmail.com",
        bcrypt.hashSync("Pickford10$", 10),
        "local",
        "default.png"
      );
      const userRepository = dataSource.getRepository(userEntity);
      Promise.all([userRepository.save(user1), userRepository.save(user2)])
        .then((values) => {
          console.log("saved");
        })
        .catch((err) => {
          console.log("not saved " + err);
        });
    })
    .catch((err) => console.log(err));
};

module.exports = dataSource;
