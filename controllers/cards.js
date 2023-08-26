const Card = require('../models/card');

// Card add controller
module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Get cards controller
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

// Delete card controller
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ message: 'Card remove' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
};

// Like add controller
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
};

// Delete like controller
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
};
