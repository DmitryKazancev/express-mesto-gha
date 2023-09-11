const mongoose = require('mongoose');
const httpRegex = require('../utils/constants');

// Mongoose DB schema for card
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
    minlength: [2, 'Minimum 2 character'],
    maxlength: [30, 'Maximum 30 character'],
  },
  link: {
    type: String,
    required: [true, 'Link field is required'],
    validate: {
      validator(link) {
        return httpRegex.test(link);
      },
      message: 'Card link available',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
  createAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
