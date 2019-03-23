// Dependencies

//Express Async Errors
require('express-async-errors');

// Calss Validator
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// config (npm)
const config = require('config');

// Debug (npm)
const debug = require('debug')('app:startup');

// Helmet (npm)
const helmet = require('helmet');

// Morgan (npm)
const morgan = require('morgan');

// Mongoose (npm)
const mongoose = require('mongoose');

// My error middelware
const logger = require('./middleware/logger'); //General logs
const error = require('./middleware/error'); //Routes log

// Routes
const coursesRoutes = require('./routes/courses');
const authorsRoutes = require('./routes/authors');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const home = require('./routes/home');

// Build a web server
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

app.set('view engine', 'pug');
app.set('views', './views'); //default
app.use(express.json()); // Builtin middelware who parse the request body to json > req.body
app.use(express.urlencoded( { extended: true } )); // Built-in middleware who convert this key=value&key=value into a json object
app.use(express.static('public')); // Built-in middleware who published the static content in "public" folder
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use('/api/courses', coursesRoutes); // Routes for /api/courses
app.use('/api/authors', authorsRoutes); // Routes for /api/authors
app.use('/api/users', usersRoutes); // Routes for /api/users
app.use('/api/auth', authRoutes); // Routes for /api/auth
app.use('/', home); // Routes for /

app.use(error);

process.on('uncaughtException', (ex) => {
  logger.error(ex.message, ex);
});

//throw new Error('Somehing went wrong durng startup!');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

//console.log('Mail Password ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // HTTP request logger
    debug('Morgan enabeled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { 
    console.log(`Listening on port ${port}...`);
});