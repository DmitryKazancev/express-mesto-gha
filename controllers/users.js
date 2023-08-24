const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports.getUserById = (req, res) => {
  if (req.params.userId.length === 24) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'User not found' });
          return;
        }
        res.send(user);
      })
      .catch(() => res.status(404).send({ message: 'User not found' }));
  } else {
    res.status(400).send({ message: 'Incorrect id' });
  }
};

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
