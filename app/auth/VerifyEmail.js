const User = require('../user/User');

function verifyEmail(req, res, next) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).send({message : 'Error on the server.'});
    }
    if (user) {
      return res.status(409).send({message : 'Email already exist'});
    }
    next();
  });
}

module.exports = verifyEmail;
