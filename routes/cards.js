const router = require('express').Router();

// Import controllers for cards
const {
  addCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

// Routes for card
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', addCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
