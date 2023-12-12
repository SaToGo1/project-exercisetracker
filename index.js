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
      res.status(201).json({
        username: userData.username,
        _id: userData._id
      })
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ error: 'Failed to add user' });
    });
})

// Response with all the users
app.get('/api/users', (req, res) => {
  getAllUsers()
    //res.json({ username: users.username, _id: users._id }
    .then(users => {
      res.status(200).json(users.map(el => {
        return {
          _id: el._id,
          username: el.username
        }
      }))
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);

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
          res.status(201).json({
            _id: user._id,
            username: user.username,
            date: date,
            duration: duration,
            description: description,
          })
        })
        .catch(err => {
          console.log(err)
          return res.status(400).json({ msg: err })
        })
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ error: 'Failed to add exercise' });
    });
})

// GET request to /api/users/:_id/logs
app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;

  const from = new Date(req.query.from);
  const isFrom = req.query.from != undefined;
  
  const to = new Date(req.query.to);
  const isTo = req.query.to != undefined;
  
  let limit = req.query.limit;
  const isLimit = req.query.limit != undefined;
  
  FindAndPopulateUser({ id })
    .then(user => {
      const logs = user.log
        // Elements that doesnt met query conditions are returned as null
        .map((el) => {
          // DATES
          const date = new Date(el.date)
          // DATE inferior to 'from' or bigger than 'to' returns null.
          if (isFrom && date < from) return null;
          if (isTo && date > to) return null;

          // LIMIT ENTRIES
          if (isLimit && limit <= 0){
            return null;
          }
          if(isLimit && limit > 0){
            limit --;
          }
          
          return {
            description: el.description,
            duration: el.duration,
            date: date
          }
        })
        // Eliminate Elements that don't met query conditions
        .filter(el => el != null)
        // sort the exercises by the dates in Ascending order
        // being the first one the most recent
        .sort((el1, el2) => el2.date.getTime() - el1.date.getTime())
        // Change format for date.
        .map(el => ({
            ...el,
            date: el.date.toDateString()
          }))

      // Build the Response
      // First part of the output
      let output = {
        _id: id,
        username: user.username,
      }

      // add query if exists to the output
      if (isFrom) output = {
            ...output,
            from: from.toDateString()
      }

      if (isTo) output = {
            ...output,
            to: to.toDateString()
      }

      // Add the logs to the output
      output = {
        ...output,
        count: logs.length,
        log: logs
      }
      
      // Serve output.
      res.status(200).json(output)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  
})

app.get('/api/clear', (req, res) => {
  clearUsers();
  clearExercises();
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
