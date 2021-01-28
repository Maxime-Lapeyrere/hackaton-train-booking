var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var users = require('../models/users')


var createUser = async (data) => {
  var newUser = new users ({
    lastName: data.lastNametoLowerCase(),
    firstName: data.firstName.toLowerCase(),
    email: data.email.toLowerCase(),
    pwd: data.pwd,
    journeys: [ ]
  });
  console.log("newUser : ");//DEBUG
  console.log(newUser);//DEBUG
  var userSaved = await newUser.save();
  console.log("newUser_DB : ");//DEBUG
  console.log(await userModel.find());//DEBUG

  return userSaved;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user)
    res.redirect('/login', { error: ""});
  res.render('index', { title: 'Ticketac' });
});

// LOGIN PAGE
router.get('/login', async function(req, res, next) {
  res.render('/login', { error: ""});
});

// SIGN-IN
router.post('/sign-in', async function(req, res, next) {
  console.log(req.body);//DEBUG
  var user = await userModel.findOne({ email : req.body.email.toLowerCase(), pwd : req.body.pwd});
  if (user) {
    req.session.user.name = user.name;
    req.session.user.id = user._id;
    res.redirect('/', { user: user});
  }
  else {
    res.render('/login', { error: "Utilisateur inconnu"});
  }
});

// SIGN-UP
router.post('/sign-up', async function(req, res, next) {
  var user = await userModel.findOne({ email : req.body.email.toLowerCase()});
  if (user) {
    res.redirect('/login', { error: "L'utilisateur existe déjà, utilisez le formulaire sign-in"});
  }
  else {
    user = createUser(req.body);
    req.session.user.name = user.name;
    req.session.user.id = user._id;
    res.render('/');
  }
});

module.exports = router;
