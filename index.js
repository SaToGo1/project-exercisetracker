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

let User = mongoose.model('users', userSchema)

const exerciseSchema = mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
})

let Exercise = mongoose.model('exercises', exerciseSchema)


//
//  SERVICES
//

//
// USERS 
//

// Add a user, returns a promise with it's data.
const addUser = (name) => {
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
      console.log('data retrieved =', data)
      return data;
    })
    .catch(err => console.log(err))
}

// Clear all the users in the database.
const clearUsers = () => {
  User.deleteMany({})
    .then(() => console.log('All Users Deleted'))
}
clearUsers();

//
// EXERCISES
//

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
  let username = req.body.username
  addUser(username)
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
  console.log(req.body)
  console.log(req.body.description);
  console.log(req.params._id)
  console.log(req.body.date)
  console.log(req.body.duration)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
