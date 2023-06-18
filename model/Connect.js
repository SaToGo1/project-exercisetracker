const mongoose = require('mongoose');

const URI = process.env['MY_URI'];

function connectDatabase () {
  mongoose.connect(URI)
  .then(() => {
    console.log('\n=>', 'connected to the Database', '\n')
  })
  .catch(err => console.log('\n', err))  
}

module.exports = connectDatabase;
