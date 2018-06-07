const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const VerifyToken = require('../auth/VerifyToken');
const User = require('./User');

router.use(bodyParser.urlencoded({ extended: true }));

// @TODO
// Define solution for adding comment
router.get('/newer', VerifyToken, (req, res) => {
  User.find({}, 'snapchat photo')
      .sort('-registerDate')
      .limit(55)
      .exec((err, user) => {
        if (err) {
          return res.status(500).send("There was a problem finding the user.");
        }
        if (!user) {
          return res.status(404).send("No user found.");
        }
        res.status(200).send(user);
      });
    });

// @TODO
// Define solution for adding comments
router.put('/update-profile', VerifyToken, (req, res) => {
  const { snapchat, instagram, sex, origin, eyesColor, birthDate } = req.body;
  let updatedData = {
    snapchat: snapchat,
    instagram: instagram,
    sex: sex,
    origin: origin,
    eyesColor: eyesColor,
    birthDate: birthDate
  };
  User.findOneAndUpdate(req.userId, updatedData, (err, user) => {
    if (err) {
      return res.status(500).send(
        {
          message: `There was a problem when updating user with id ${req.userId}`,
          error: err.message
        }
      )
    }
    if (!user) {
      return res.status(404).send("No user found.");
    }
    res.status(200).send({updated : true});
  });
});

// @TODO
// Define solution for adding comment
router.get('/my-profile', VerifyToken, (req, res) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err) {
      return res.status(500).send("There was a problem finding the user.");
    }
    if (!user) {
      return res.status(404).send("No user found.");
      }
      res.status(200).send(user);
    });
  });

// @TODO
// Define solution for adding comment
router.get('/:userId', VerifyToken, function (req, res) {
  User.findById(req.params.userId, { password: 0, registerDate: 0, email : 0} , function (err, user) {
    if (err) {
      return res.status(500).send("There was a problem finding the user from /:userId");
    }
    if (!user) {
      return res.status(404).send("No user found.");
    }
    res.status(200).send(user);
  });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, { password: 0, registerDate: 0, email : 0}, function (err, users) {
      if (err) return res.status(500).send("There was a problem finding the users.");
      res.status(200).send(users);
  });
});

module.exports = router;
