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

var add_to_basket = async (user_id, journey_id) => {
  var already_exists = false;
  var user = await users.findById(user_id);

  for (var i = 0; i < user.journeys.length; i++) {
    if (user.journeys[i].id == journey_id) {
      user.journeys[i].quantity++;
      already_exists = true;
    }
  }
  if (already_exists === false)
    user.journeys.push({ id: journey_id, quantity: 1});
  user = await user.save();
  return user;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.email)
    res.redirect('/login');
  res.render('journey', { routename: '' });
});

// LOGIN PAGE
router.get('/login', async function(req, res, next) {
  res.render('login', { error: "", routename: 'login'});
});

// SIGN-IN
router.post('/sign-in', async function(req, res, next) {
  var shaPwd = SHA256(req.body.pwd).toString(encBase64);
  var user = await users.findOne({ email : req.body.email.toLowerCase(), pwd : shaPwd });
  
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
  user = await add_to_basket(req.session.user_id, req.query.id);
  res.redirect('/basket');
});

// router.get('/refresh', async function(req, res, next){
//   var user = await users.findById(req.session.user_id);
//   var journey = await user.journeys.findById(req.query.id);
//   console.log(journey);
//   journey.quantity = req.query.quantity;
//   journey = journey.save();
//   res.redirect('/basket');
// });

router.get('/refresh', async function(req, res, next){
  var user = await users.findById(req.session.user_id);
  var journey = await user.journeys.findById(req.query.id);
  console.log(journey);
  journey.quantity = req.query.quantity;
  journey = journey.save();
  res.redirect('/basket');
})

router.get('/remove', async function(req, res, next) {
  var user = await users.findById(req.session.user_id);
  var trips = user.journeys.filter(journey => journey.id != req.query.id);

  user.journeys = trips;
  user.save();
  res.redirect('/basket');
})

router.get('/basket', async function(req, res, next) {
  req.session.trips = [];
  var user = await users.findById(req.session.user_id);
  console.log("user.journeys :");
  console.log(user.journeys);

  for (var i = 0; i < user.journeys.length; i++){
    var quantity = user.journeys[i].quantity;
    req.session.trips.push( { 
      trip : await journeys.findById(user.journeys[i].id),
      quantity: user.journeys[i].quantity });
  }
  res.render('basket', { myJourneys : req.session.trips,  routename: ''  });
});

router.get('/lastrip', async function(){
  res.render('mylasttrips', { myJourneys : myJourneys,  routename: 'lastrip'  });
})
router.get('/myplanedtrips', async function(){
  res.render('comingtrips', { myJourneys : myJourneys,  routename: 'planedtrips'  });
})
module.exports = router;
