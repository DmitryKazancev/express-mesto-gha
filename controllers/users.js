const User = require('../models/user');

// Add user controller
module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Get all users controller
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

// Get user by user ID controller
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .onFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Incorrect id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
};

// Edit info about user controller
module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: 'true' })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(500).send({ message: 'User not found' });
        }
      });
  } else {
    res.status(500).send({ message: 'Server error' });
  }
};

// Edit user avatar controller
module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: 'true' })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(500).send({ message: 'User not found' });
        }
      });
  } else {
    res.status(500).send({ message: 'Server error' });
  }
};
