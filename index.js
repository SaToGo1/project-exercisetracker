const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/user-routes.js');

const bodyParser = require('body-parser');

const connectDatabase = require('./model/Connect.js');
connectDatabase();

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded())

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// this is for testing purpose
app.get('/api/clear', (req, res) => {
  clearUsers();
  clearExercises();
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
