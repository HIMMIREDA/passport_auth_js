const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");


const registerUser = asyncHandler(async (req, res, next) => {
    const userRepository = dataSource.getRepository(userEntity);
    const { email, username, password } = req.body;
  
    const user = await userRepository.findOne({
      where: {
        email,
      },
    });
  
    if (user) {
      res.status(401);
      return next(new Error(`A user with ${email} already exists`));
    }
  
    const savedUser = await userRepository.save(
      new User(null, username, email, bcrypt.hashSync(password, 10), "local")
    );
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = {
        id: savedUser.id,
      };
      req.session.save((err) => {
        if (err) return next(err);
        return res.status(201).json({
          id: savedUser.id,
        });
      });
    });
  });

const getMe = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    username: req.user.username,
    email: req.user.email,
    photo: req.user.photo,
    provider: req.user.provider,
  });
});

module.exports = {
    registerUser,
    getMe,
};
