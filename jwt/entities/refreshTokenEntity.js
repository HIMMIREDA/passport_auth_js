const { EntitySchema } = require("typeorm");
const RefreshToken = require("../models/refreshTokenModel");

module.exports = new EntitySchema({
  name: "RefreshToken",
  target: RefreshToken,
  tableName: "refresh_tokens",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    refreshToken: {
      type: "text",
    },
  },
  relations:{
    user:{
        target:  "User",
        type: "many-to-one",
        onDelete: "CASCADE",
    }
  }
});
