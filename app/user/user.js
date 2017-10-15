const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email !',
    },
    required: [true, 'User email is required']
  },
  password: {
    type: String,
    required: true
  },
  snapchat: {
    type: String,
    minlength: [3, 'User snapchat can not be valid'],
    required: true
  },
  instagram: {
    type: String,
    minlength: [3, 'User instagram can not be valid'],
    required: true
  },
  photo: {
    type: String
  },
  registerDate: {
    type: String
  },
  sexe: {
    type: String,
    required: true,
    validator: {
      validate(value){
        return value === 'male' || value === 'female';
      },
      message: 'User sex should be male or female'
    }
  },
  origin: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  eyesColor: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: true
  }
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
