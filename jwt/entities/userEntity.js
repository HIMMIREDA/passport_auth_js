const { EntitySchema } = require("typeorm");
const userModel = require("../models/userModel");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  target: userModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    roles: {
      target: "Role",
      type: "many-to-many",
      cascade: ["insert","update"],
      joinTable: true,
    },
    refreshTokens: {
      target: "RefreshToken",
      type: "one-to-many",
      cascade: true,
      inverseSide: "user",
    },
  },
});
