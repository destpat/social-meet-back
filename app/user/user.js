var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  snapchat: String,
  instagram: String,
  password: String,
  confirmedPassword: String
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
