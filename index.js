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
    console.log('\n','=>', 'connected to the Database', '\n')
  })
  .catch(err => console.log('\n', err))

const userSchema = mongoose.Schema({
  username: String,
})

let User = mongoose.model('users', userSchema)

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
// addUser('Lix') // For testing REMEMBER TO DELETE  -----


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
   console.log(req.body)
   console.log(req.body.username)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
