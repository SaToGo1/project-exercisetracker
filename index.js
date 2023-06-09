const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const URI = process.env['MY_URI']
const mongoose = require('mongoose')

// const bodyParser = require('body-parser')

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => {
    console.log('\n', 'connected to the Database')
  })
  .catch(err => console.log('\n', err))

// const userSchema = mongoose.Schema({
//   username: String,
// })


app.use(cors())
app.use(express.static('public'))
// app.use(bodyParser.urlencoded())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// app.post('/api/users', (req, res) => {
//   console.log(req.body)
//   console.log(req.body.username)
// })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
