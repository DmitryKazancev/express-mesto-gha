const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ForbiddenStatus = require('../errors/ForbiddenStatus');
const Card = require('../models/card');

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
      } else {
        next(err);
      }
    });
};

// Get cards controller
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// Delete card controller
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenStatus('Not permission for card');
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.send({ message: 'Card remove' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequest('Incorrect card id'));
          } else if (err.name === 'DocumentNotFoundError') {
            next(new NotFound('Card not found'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFound('Incorrect card id'));
      } else {
        next(err);
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
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Card not found'));
      } else {
        next(err);
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
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Card not found'));
      } else {
        next(err);
      }
    });
};
