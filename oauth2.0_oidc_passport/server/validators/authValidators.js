const joi = require("joi");
const passComplexity = require("joi-password-complexity");

const registerBodyValidator = (body) => {
  const schema = joi.object({
    username: joi.string().required().min(4).label("username"),
    email: joi.string().email().required().label("email"),
    password: passComplexity().required().label("password"),
    passwordVerif: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

  return schema.validate(body);
};

const loginBodyValidator = (body) => {
  const schema = joi.object({
    email: joi.string().email().required().label("email"),
    password: joi.required().label("password"),
  });

  return schema.validate(body);
};

module.exports = {
  loginBodyValidator,
  registerBodyValidator,
};
