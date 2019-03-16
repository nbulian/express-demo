// Dependencies

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

// My middelware
const logger = require('./middleware/logger');

// Routes
const coursesRoutes = require('./routes/courses');
const authorsRoutes = require('./routes/authors');
const home = require('./routes/home');

// Build a web server
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //default

app.use(express.json()); // Builtin middelware who parse the request body to json > req.body
app.use(express.urlencoded( { extended: true } )); // Built-in middleware who convert this key=value&key=value into a json object
app.use(express.static('public')); // Built-in middleware who published the static content in "public" folder
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(logger); // Installing my middelware
app.use('/api/courses', coursesRoutes); // Routes for /api/courses
app.use('/api/authors', authorsRoutes); // Routes for /api/authors
app.use('/', home); // Routes for /

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