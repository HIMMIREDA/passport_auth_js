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
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
    provider: {
      type: "varchar",
      default: "local",
    },
    photo: {
      type: "varchar",
      default: "default.png",
    },
    created_at: {
      createDate: true,
      type: "timestamp",
    },
    update_at: {
      updateDate: true,
      type: "timestamp",
    },
  },
});
