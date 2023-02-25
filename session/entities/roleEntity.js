const { EntitySchema } = require("typeorm");
const roleModel = require("../models/roleModel");

module.exports = new EntitySchema({
  name: "Role",
  tableName: "roles",
  target: roleModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    role: {
      type: "varchar",
      unique: true,
    }
  },
});
