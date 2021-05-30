const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database');

const authController = require('./controllers/authController')
const landController = require('./controllers/landController')

// settings
app.set('port', process.env.PORT || 4000)


// middlewares
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', require('./controllers/authController'));
app.use('/api/land', require('./controllers/landController'))


app.listen(app.get('port'));
console.log('Server on port', app.get('port'));

module.exports = app
