const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');

// Add user controller
module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
        // res.status(400).send({ message: err.message });
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
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
        // res.status(400).send({ message: 'Incorrect id' });
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound(`Not found user with id: ${req.params.userId}`));
        // res.status(404).send({ message: 'User not found' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Server error' });
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
          // res.status(400).send({ message: err.message });
        } else {
          next(new NotFound(`Not found user with id: ${req.params.userId}`));
          // res.status(500).send({ message: 'User not found' });
        }
      });
  } else {
    next(new NotFound(`Not found user with id: ${req.params.userId}`));
    // res.status(500).send({ message: 'Server error' });
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
          // res.status(400).send({ message: err.message });
        } else {
          next(new NotFound(`Not found user with id: ${req.params.userId}`));
          // res.status(500).send({ message: 'User not found' });
        }
      });
  } else {
    next(new NotFound(`Not found user with id: ${req.params.userId}`));
    // res.status(500).send({ message: 'Server error' });
  }
};
