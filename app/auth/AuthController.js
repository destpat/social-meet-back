let express = require('express');
let jwt = require('jsonwebtoken');
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');
let User = require('../user/User');
let config = require('../config');
let VerifyToken = require('./VerifyToken');
let router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {

  console.log('cathced by register route');

  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  let hashedConfirmedPassword = bcrypt.hashSync(req.body.confirmedPassword, 8);
  User.create({
    email : req.body.email,
    password : hashedPassword,
    confirmedPassword : hashedConfirmedPassword,
    snapchat: req.body.snapchat,
    instagram: req.body.instagram
  },
  (err, user) => {
    if (err) {
      return res.status(500).send("There was a problem registering the user.")
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
