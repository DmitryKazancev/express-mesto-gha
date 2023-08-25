const router = require('express').Router();

// Import controllers for users
const {
  getUsers, getUserById, addUser, editUserData, editUserAvatar,
} = require('../controllers/users');

// Routes for users
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
