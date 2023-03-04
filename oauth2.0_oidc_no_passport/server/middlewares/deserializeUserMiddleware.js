const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");

const exclude = (user, ...properties) => {
  for (const prop of properties) {
    delete user[prop];
  }

  return user;
};

const deserializeUser = async (req, res, next) => {
  const userId = req.session?.user?.id;
  const userRepository = dataSource.getRepository(userEntity);
  if (!userId) {
    res.status(401);
    return next(new Error("Unauthorized!"));
  }

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    res.status(401);
    return next(new Error("Unauthorized!"));
  }

  req.user = exclude(user, "password", "created_at", "updated_at");
  return next();
};

module.exports = deserializeUser;
