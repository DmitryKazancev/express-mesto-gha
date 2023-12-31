const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser } = require('../controllers/users');
const httpRegex = require('../utils/constants');

router.post('/', celebrate(
  {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(httpRegex),
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  },
), addUser);

module.exports = router;
