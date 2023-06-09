const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const URI = process.env['MY_URI']
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

// ###################
// # Moongoose Logic #
// ###################
mongoose.connect(URI)
  .then(() => {
    console.log('\n=>', 'connected to the Database', '\n')
  })
  .catch(err => console.log('\n', err))

//
//  SCHEMAS AND MODELS
//
const userSchema = mongoose.Schema({
  username: String,
})

const User = mongoose.model('users', userSchema)

const exerciseSchema = mongoose.Schema({
  _id: String,
  username: String,
  date: String,
  duration: Number,
  description: String,
})

const Exercise = mongoose.model('exercises', exerciseSchema)


//
//  SERVICES
//

//
// USERS 
//

// Add a user, returns a promise with it's data.
const addUser = ({ name }) => {
  let user = new User({
    username: name
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
      console.log('All users retrieved =', data)
      return data;
    })
    .catch(err => console.log(err))
}

// Clear all the users in the database.
const clearUsers = () => {
  User.deleteMany({})
    .then(() => console.log('All Users Deleted'))
}

// Retrieve user by id
const getUserById = ({ id }) => {
  return User.find({ _id: id })
    .then(data => {
      console.log('user retrieved by id =', data)
      return data[0];
    })
    .catch(err => console.log(err))
}

//
// EXERCISES
//

const addExercise = ({ id, username, date, duration, description }) => {
  console.log(`id from addExercise ${id}`)
  console.log(id)
  let exercise = new Exercise({
    _id: id,
    username: username,
    date: date,
    duration: duration,
    description: description,
  })

  return exercise.save()
    .then(data => {
      console.log('==>', `Added exercise for user: ${data.username}`)
      return data;
    })
    .catch(err => console.log('error saving exercise', '\n', err))
}

// #################
// # Express Logic #
// #################
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  let userName = req.body.username
  addUser({ 
    name: userName 
  })
    .then(userData => {
      res.json({
        username: userData.username,
        _id: userData._id
      })
    })
})

app.get('/api/users', (req, res) => {
  getAllUsers()
    .then(users => res.json(users))
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  
  let date = new Date(req.body.date);
  date = date.toDateString();

  getUserById({ id })
    .then(user => 
      addExercise({
        id: id,
        username: user.username,
        date: date,
        duration: duration,
        description: description,
      })
    )
    .then(exercise => {
      res.json(exercise)
    })
    .catch(err => console.log(err))
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
