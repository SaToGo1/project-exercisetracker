const mongoose = require('mongoose');
const { Schema } = mongoose;

// #########
// # Model #
// #########
const userSchema = Schema({
  username: String,
  log: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
})

const User = mongoose.model('User', userSchema, 'User')

// #############
// # Functions #
// #############
// Add a user, returns a promise with it's data.
const addUser = ({ name }) => {
  let user = new User({
    username: name,
    log: []
  })

  return user.save()
    .then(data => {
      console.log('==>', `Added user ${data.username}`)
      return data;
    })
    .catch(err => console.log(err))
}

// Retrieve all the users, returns a promise.
const getAllUsers = () => {
  return User.find({})
    .then(data => {
      console.log('All users retrieved')
      return data;
    })
    .catch(err => console.log(err))
}

// Clear all the users in the database.
const clearUsers = () => {
  User.deleteMany({})
    .then(() => console.log('===>', 'All Users Deleted'))
}

// Retrieve user by id
const getUserById = ({ id }) => {
  return User.find({ _id: id })
    .then(data => {
      console.log('user retrieved by id =', data[0].username)
      return data[0];
    })
    .catch(err => console.log(err))
}

// ##########
// # Export #
// ##########
module.exports = {
  User,
  addUser,
  getAllUsers,
  clearUsers,
  getUserById
}