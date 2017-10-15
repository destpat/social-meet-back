const express = require('express');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('../user/User');
const config = require('../config');
const VerifyToken = require('./VerifyToken');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
  if (req.body.password !== req.body.confirmedPassword || req.body.password.length < 8) {
    return res.status(500).send("There was a problem registering the user.")
  }
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    email : req.body.email,
    photo : req.body.photo,
    registerDate: moment().format("YYYY-MM-DD"),
    snapchat: req.body.snapchat,
    instagram: req.body.instagram,
    password : hashedPassword,
    sexe: req.body.sexe,
    origin: req.body.origin,
    city: req.body.city,
    eyesColor: req.body.eyesColor,
    birthDate: req.body.birthDate
  },(err, user) => {
    if (err) {
      return res.status(500).send(err)
    }
    // create a token
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).send({message : 'Error on the server.'});
    }
    if (!user) {
      return res.status(404).send({message : 'Username or password incorrect'});
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null, message : 'username or password incorrect' });
    }
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/my-profile', VerifyToken, (req, res, next) => {
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

module.exports = router;
