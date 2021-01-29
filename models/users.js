mongoose = require('mongoose');


var UserSchema = mongoose.Schema({
  lastName: String,
  firstName: String,
  email: String,
  pwd: String,
  journeys: [ { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' }, 
    quantity: Number 
  }]
});

var userModel = mongoose.model('users', UserSchema);

module.exports = userModel;