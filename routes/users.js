const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// Import controllers for users
const {
  getUsers, getUserById, editUserData, editUserAvatar, getMeInfo,
} = require('../controllers/users');

// Routes for users
router.get('/', getUsers);
router.get('/me', getMeInfo);

router.get('/:userId', celebrate(
  {
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  },
), getUserById);
// router.get('/:userId', getUserById);

// router.post('/', addUser);
router.patch('/me', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(3).max(30),
    }),
  },
), editUserData);
router.patch('/me/avatar', celebrate(
  {
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    }),
  },
), editUserAvatar);

module.exports = router;
