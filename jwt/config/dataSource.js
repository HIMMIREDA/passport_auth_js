const { DataSource } = require("typeorm");
const Role = require("../models/roleModel");
require("dotenv").config();
const roleEntity = require("../entities/roleEntity");
const userEntity = require("../entities/userEntity");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASENAME,
  synchronize: true,
  dropSchema: true, // change this if you dont want drop-create schema on restart
  logging: true,
  entities: [__dirname + "/../entities/*{.js,.ts}"],
  subscribers: [],
  migrations: [],
});

dataSource.initDb = function () {
  this.initialize()
    .then(() => {
      const userRepository = dataSource.getRepository(User);
      const roleRepository = dataSource.getRepository(roleEntity);
      const adminRole = roleRepository.create({
        role: Role.ROLES.ADMIN,
      });

      const userRole = roleRepository.create({
        role: Role.ROLES.USER,
      });

      Promise.all([
        roleRepository.save(adminRole),
        roleRepository.save(userRole),
      ])
        .then(([adminRole, userRole]) => {
          const user1 = userRepository.create({
            username: "reda123",
            email: "reda@gmail.com",
            password: bcrypt.hashSync("Arabicat88@", 10),
            roles: [adminRole, userRole],
          });

          const user2 = userRepository.create({
            username: "wafaa123",
            email: "wafaa@gmail.com",
            password: bcrypt.hashSync("Arabicat88@", 10),
            roles: [userRole],
          });

          Promise.all([userRepository.save(user1), userRepository.save(user2)])
            .then((_) => {
              console.log("saved");
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log("not saved " + err);
        });
    })
    .catch((err) => console.log(err));
};

module.exports = dataSource;
