mongoose = require('mongoose');


var UserSchema = mongoose.Schema({
  lastName: String,
  firstName: String,
  email: String,
  pwd: String,
  journeys: [ 
    { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' } ]
});

var userModel = mongoose.model('users', UserSchema);

module.exports = userModel;