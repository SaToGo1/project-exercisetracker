const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');

// ############
// # Database #
// ############
const connectDatabase = require('./model/Connect.js');
connectDatabase();

const {
  User,
  addUser,
  getAllUsers,
  clearUsers,
  getUserById
} = require('./model/User.js');

const {
  Exercise,
  addExercise,
  addExerciseToUserID,
  clearExercises
} = require('./model/Exercise.js');

const {
  FindAndPopulateUser
} = require('./model/Logs.js')
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

// Response with all the users
app.get('/api/users', (req, res) => {
  getAllUsers()
    //res.json({ username: users.username, _id: users._id }
    .then(users => {
      res.json(users.map(el => {
        return {
          _id: el._id,
          username: el.username
        }
      }))
    })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);

  // TODO: if date is empty ( === undefined) put TODAY as date.
  let date = new Date(req.body.date);
  if (req.body.date === undefined) date = new Date()
  date = date.toDateString();
  
  addExercise({
    date: date,
    duration: duration,
    description: description,
  })
    .then(exercise => {
      getUserById({ id })
        .then((_) =>
          addExerciseToUserID({
            id: id,
            exercise: exercise
          })
        )
        .then(user => {
          res.json({
            _id: user._id,
            username: user.username,
            date: date,
            duration: duration,
            description: description,
          })
        })
        .catch(err => console.log(err))
    })
})

// GET request to /api/users/:_id/logs
app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;

  const from = new Date(req.query.from);
  const isFrom = from != undefined;
  const to = new Date(req.query.to);
  const isTo = to != undefined;
  let limit = req.query.limit;
  const isLimit = limit != undefined;

  console.log('from', from) // -------------------------------------
  console.log('isFrom', isFrom) // -------------------------------------
  console.log('to', to) // -------------------------------------
  console.log('isTo', isTo) // -------------------------------------
  console.log('limit', limit) // -------------------------------------
  console.log('isLimit', isLimit) // -------------------------------------
  FindAndPopulateUser({ id })
    .then(user => {
      console.log(user.log)
      const logs = user.log.map((el) => {
        // LIMIT ENTRIES
        if (isLimit && limit <= 0){
          return;
        }
        if(isLimit && limit > 0){
          limit --;
        }
        
        // DATES
        const date = new Date(el.date)
        if (isFrom && date < from) return ;
        if (isTo && date > to) return ;
        
        return {
          description: el.description,
          duration: el.duration,
          date: date.toDateString()
        }
      }).filter(el => el != null)
      res.json({
        _id: id,
        username: user.username,
        count: user.log.length,
        log: logs
      })
    })
  
})

app.get('/api/clear', (req, res) => {
  clearUsers();
  clearExercises();
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
