const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const VerifyToken = require('../auth/VerifyToken');
const User = require('./User');

router.use(bodyParser.urlencoded({ extended: true }));

// @TODO comment
router.get('/newer', VerifyToken, function (req, res) {
    User.find({}, 'snapchat photo')
        .sort('-registerDate')
        .limit(55)
        .exec(function (err, users) {
          if (err) {
            return res.status(500).send("There was a problem finding the users.");
          }
          res.status(200).send(users);
        });
      });

router.get('/:userId', VerifyToken, function (req, res) {
  User.findById(req.params.userId, { password: 0, registerDate: 0, email : 0} , function (err, user) {
    if (err) {
      return res.status(500).send("There was a problem finding the user.");
    }
    if (!user) {
      return res.status(404).send("No user found.");
    }
    res.status(200).send(user);
  });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
      if (err) return res.status(500).send("There was a problem finding the users.");
      res.status(200).send(users);
  });
});

module.exports = router;
