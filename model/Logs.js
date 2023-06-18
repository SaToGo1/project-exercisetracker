// Even though logs are part of users i separated the 
// Logic that deal with the logs inside the user here
const mongoose = require('mongoose');
const { User, getUserById } = require('./User.js');
const { Exercise } = require('./Exercise.js');

function FindAndPopulateUser({ id }) {
  return User.findOne({ _id: id }).populate('log')
    .then(user => {
      return user
    })
  .catch(err => console.log('error at FindAndPopulateUser\n', err))
}

module.exports = {
  FindAndPopulateUser
}