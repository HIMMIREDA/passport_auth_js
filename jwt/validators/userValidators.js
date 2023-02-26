const joi = require("joi");
const joiPassComplexity = require("joi-password-complexity");
const { ROLES } = require("../models/roleModel");

const userParamsValidator = (params) => {
  const schema = joi.object({
    id: joi.number().required().label("id"),
  });

  return schema.validate(params);
};

const updateUserBodyValidator = (body) => {
  const schema = joi.object({
    username: joi.string().label("username"),
    email: joi.string().email().label("email"),
    password: joiPassComplexity().label("password"),
    roles: joi.array().items(joi.string().valid(...Object.values(ROLES))),
  }).min(1).label("body");
  return schema.validate(body);
};

module.exports = {
  userParamsValidator,
  updateUserBodyValidator,
};
