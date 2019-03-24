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

// Build a web server
const express = require('express');
const app = express();
require('./startup/routes')(app);

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

app.set('view engine', 'pug');
app.set('views', './views'); //default

process.on('uncaughtException', (ex) => {
  logger.error(ex.message, ex);
});

process.on('unhandledRejection', (ex) => {
  throw ex;
});

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