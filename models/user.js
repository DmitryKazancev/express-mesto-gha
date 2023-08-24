const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
    minlength: [2, 'Minimum 2 character'],
    maxlength: [30, 'Maximum 30 character'],
  },
  about: {
    type: String,
    required: [true, 'About field is required'],
    minlength: [2, 'Minimum 2 character'],
    maxlength: [30, 'Maximum 30 character'],
  },
  avatar: {
    type: String,
    required: [true, 'Link field is required'],
    validate: {
      validator(link) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(link);
      },
      message: 'Avatar link',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
