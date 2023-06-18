const mongoose = require('mongoose');
const { Schema } = mongoose;

const { User } = require('./User.js');
// #########
// # Model #
// #########
const exerciseSchema = Schema({
  date: String,
  duration: Number,
  description: String,
})

const Exercise = mongoose.model('Exercise', exerciseSchema, 'Exercise')

// #############
// # Functions #
// #############
const addExercise = ({ date, duration, description }) => {
  let exercise = new Exercise({
    date: date,
    duration: duration,
    description: description,
  })

  return exercise.save()
    .then(data => {
      console.log('==>', `Added exercise`)
      return data;
    })
    .catch(err => console.log('error Adding exercise:\n', err))
}

const addExerciseToUserID = ({ id, exercise }) => {
  return User.findById({ _id: id })
    // UPDATING user with exercise
    .then(user => {
      user.log.push(exercise._id)
      return user
    })
    // SAVING the user with new exercise
    .then(userModified => userModified.save())
    // Writing on console.
    .then(userModified => {
      console.log('==>', `Added exercise for user: ${userModified.username}`)
      return userModified
    })
    .catch((err => console.log('error adding exercise to user:\n', err)))
}

// Clear all the exercises in the database.
const clearExercises = () => {
  Exercise.deleteMany({})
    .then(() => console.log('===>', 'All Exercises Deleted'))
}

// ##########
// # Export #
// ##########
module.exports = {
  Exercise,
  addExercise,
  addExerciseToUserID,
  clearExercises
}
