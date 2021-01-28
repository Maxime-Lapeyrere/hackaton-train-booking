var express = require('express');
var router = express.Router();
var users = require('../models/users');
var journeys = require('../models/journeydb');
var SHA256 = require("crypto-js/sha256");
var encBase64 = require('crypto-js/enc-base64');

var capitalize = (word) => {
  var letters = word.slice('');
  var capitalizedWord = letters[0].toUpperCase();
  for (var i = 1; i < letters.length; i++) {
    capitalizedWord += letters[i].toLowerCase();
  }
  return capitalizedWord;
};

var createUser = async (data) => {
  var newUser = new users ({
    lastName: capitalize(data.lastName),
    firstName: capitalize(data.firstName),
    email: data.email.toLowerCase(),
    pwd: SHA256(data.pwd).toString(encBase64),
    journeys: [ ]
  });
  var userSaved = await newUser.save();
  return userSaved;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.email)
    res.redirect('/login');
  res.render('basket', { routename: '' });
});

// LOGIN PAGE
router.get('/login', async function(req, res, next) {
  res.render('login', { error: "", routename: 'login'});
});

// SIGN-IN
router.post('/sign-in', async function(req, res, next) {
  var shapwd = SHA256(req.body.pwd).toString(encBase64);
  var user = await users.findOne({ email : req.body.email.toLowerCase(), pwd : shapwd });
  
  if (user) {
    req.session.email = user.email;
    req.session.user_id = user._id;
    res.redirect('/');
  }
  else {
    res.render('login', { error: "Utilisateur inconnu", routename: 'login'});
  }
});

// SIGN-UP
router.post('/sign-up', async function(req, res, next) {
  var user = await users.findOne({ email : req.body.email.toLowerCase() });
  if (user) {
    res.render('login', { error: "L'utilisateur existe déjà, utilisez le formulaire sign-in", routename: 'login' });
  }
  else {
    user = await createUser(req.body);
    req.session.email = user.email;
    req.session.user_id = user._id;
    res.redirect('/');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.post('/search', async function(req, res, next) {
  var departure = capitalize(req.body.departure);
  var arrival = capitalize(req.body.arrival);
  var date = req.body.date;
  var trips = await journeys.find({ departure : departure, arrival: arrival, date: req.body.date});

  res.render('search-results', { journeys: trips, routename:"", date });
});

router.get('/select-journey', async function(req, res, next) {
  var user = await users.findById(req.session.user_id);

  user.journeys.push(req.query.id);
  user = await user.save();
  res.redirect('/basket');
})

router.get('/basket', async function(req, res, next) {
  var user = await users.findById(req.session.user_id).populate('journeys').exec();
  // console.log(user);

  var myJourneys = user.journeys;
  // console.log('myJourneys : ');
  // console.log(myJourneys);
  res.render('basket', { myJourneys : myJourneys });
});

module.exports = router;
