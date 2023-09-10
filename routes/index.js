const router = require('express').Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');

// Routes for card
router.use('/cards', cardsRouter);
router.delete('/users', usersRouter);

module.exports = router;
