var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var users = require('../models/users');
var SHA256 = require("crypto-js/sha256");
var encBase64 = require('crypto-js/enc-base64');


var createUser = async (data) => {
  var newUser = new users ({
    lastName: data.lastName.toLowerCase(),
    firstName: data.firstName.toLowerCase(),
    email: data.email.toLowerCase(),
    pwd: SHA256(data.pwd).toString(encBase64),
    journeys: [ ]
  });
  console.log("newUser : ");//DEBUG
  console.log(newUser);//DEBUG
  var userSaved = await newUser.save();
  console.log("newUser_DB : ");//DEBUG
  console.log(await users.find());//DEBUG

  return userSaved;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.email)
    res.redirect('/login');
  res.render('index', { title: 'Ticketac' });
});

// LOGIN PAGE
router.get('/login', async function(req, res, next) {
  res.render('login', { error: ""});
});

// SIGN-IN
router.post('/sign-in', async function(req, res, next) {
  console.log(req.body);//DEBUG
  var shapwd = SHA256(req.body.pwd).toString(encBase64);
  console.log(shapwd);
  var user = await users.findOne({ email : req.body.email.toLowerCase(), pwd : shapwd });
  if (user) {
    req.session.email = user.email;
    req.session.id = user._id;
    res.redirect('/');
  }
  else {
    res.render('login', { error: "Utilisateur inconnu"});
  }
});

// SIGN-UP
router.post('/sign-up', async function(req, res, next) {
  console.log(req.body);
  var user = await users.findOne({ email : req.body.email.toLowerCase() });
  if (user) {
    res.render('login', { error: "L'utilisateur existe déjà, utilisez le formulaire sign-in" });
  }
  else {
    user = await createUser(req.body);
    req.session.email = user.email;
    req.session.id = user._id;
    res.render('/');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
