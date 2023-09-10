const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

// Card add controller
module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
        // res.status(400).send({ message: err.message });
      } else {
        next(err);
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Get cards controller
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((users) => res.status(200).send(users))
    .catch(next);
  //   () => {
  //   res.status(500).send({ message: 'Server error' });
  // });
};

// Delete card controller
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.send({ message: 'Card remove' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Incorrect card id'));
        // res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Card not found'));
        // res.status(404).send({ message: 'Card not found' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Server error' });
      }
    });
};

// Like add controller
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Incorrect card id'));
        // res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Card not found'));
        // res.status(404).send({ message: 'Card not found' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Server error' });
      }
    });
};

// Delete like controller
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Incorrect card id'));
        // res.status(400).send({ message: 'Incorrect card id' });
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Card not found'));
        // res.status(404).send({ message: 'Card not found' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Server error' });
      }
    });
};
