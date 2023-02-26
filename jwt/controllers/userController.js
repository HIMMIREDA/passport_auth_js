require("dotenv").config();
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const dataSource = require("../config/dataSource");
const userEntity = require("../entities/userEntity");
const roleEntity = require("../entities/roleEntity");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const getUsers = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);

  const users = await userRepository.find({
    relations: {
      roles: true,
    },
  });

  return res.status(200).json(
    users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      };
    })
  );
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);
  const roleRepository = dataSource.getRepository(roleEntity);
  const { id } = req.params;

  const user = await userRepository.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    res.status(404);
    return next(new Error("User not found"));
  }


  const updateFields = {
    username: req.body?.username || false,
    email: req.body?.email || false,
    password: req.body?.password
      ? bcrypt.hashSync(req.body?.password, 10)
      : false,
    roles: req.body?.roles || false,
  };

  for ([key, value] of Object.entries(updateFields)) {
    if (value) {
      if (key === "roles") {
        user[key] = await Promise.all(
          value.map((role) => roleRepository.findOne({ where: { role } }))
        );
      } else {
        user[key] = value;
      }
    }
  }

  const savedUser = await userRepository.save(user);

  return res.status(200).json(savedUser);
});

const getUser = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);
  const { id } = req.params;
  const user = await userRepository.findOne({
    where: { id },
    relations: {
      roles: true,
    },
  });
  if (!user) {
    res.status(404);
    return next(new Error("User not found"));
  }
  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const userRepository = dataSource.getRepository(userEntity);
  const { id } = req.params;
  await userRepository.delete({
    id,
  });


  return res.status(200).json({
    id,
  });
});

module.exports = {
  getUsers,
  updateUser,
  getUser,
  deleteUser
};
