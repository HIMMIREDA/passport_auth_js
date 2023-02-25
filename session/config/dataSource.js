const { DataSource } = require("typeorm");
const Role = require("../models/roleModel");
require("dotenv").config();
const roleEntity = require("../entities/roleEntity");

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASENAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/../entities/*{.js,.ts}"],
  subscribers: [],
  migrations: [],
});




// dataSource.initDb = function() {
//   this
//   .initialize()
//   .then(() => {
//     let adminRole = new Role(1, Role.ROLES.ADMIN);
//     let userRole = new Role(3, Role.ROLES.USER);
//     const roleRepository = dataSource.getRepository(roleEntity);
//     Promise.all([roleRepository.save(adminRole), roleRepository.save(userRole)])
//       .then((values) => {
//         console.log("saved");
//       })
//       .catch((err) => {
//         console.log("not saved " + err);
//       });
//   })
//   .catch((err) => console.log(err));
// }

module.exports = dataSource;
