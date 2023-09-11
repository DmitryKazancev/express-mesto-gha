const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictStatus = require('../errors/ConflictStatus');
const User = require('../models/user');

// Add user controller
module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequest(err.message));
        } else if (err.code === 11000) {
          next(new ConflictStatus('User create yet'));
        } else {
          next(err);
        }
      }));
};

// Get all users controller
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

// Get user by user ID controller
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Incorrect user id: ${req.params.userId}`));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Not found user with id: ${req.params.userId}`));
      } else {
        next(err);
      }
    });
};

// Edit info about user controller
module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: 'true' })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequest(err.message));
        } else {
          next(err);
        }
      });
  } else {
    next(new NotFound(`Not found user with id: ${req.params.userId}`));
  }
};

// Edit user avatar controller
module.exports.editUserAvatar = (req, res, next) => {
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: 'true' })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequest(err.message));
        } else {
          next(err);
        }
      });
  } else {
    next(new NotFound(`Not found user with id: ${req.params.userId}`));
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'sprint', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getMeInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};
