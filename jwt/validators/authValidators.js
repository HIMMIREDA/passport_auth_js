const joi = require("joi");
const joiPassComplexity = require("joi-password-complexity");

const signUpBodyValidator = (body) => {
  const schema = joi.object({
    email: joi.string().email().required().label("email"),
    username: joi.string().required().label("username"),
    password: joiPassComplexity().required().label("password"),
  });

  return schema.validate(body);
};


const loginBodyValidator = (body) => {
    const schema = joi.object({
        username: joi.string().required().label("username"),
        password: joi.string().required().label("password")
    });
    return schema.validate(body);
};


module.exports = {
    signUpBodyValidator,
    loginBodyValidator
};