// Dependencies

//Express Async Errors
require('express-async-errors');

// Debug (npm)
const debug = require('debug')('app:startup');

// Morgan (npm)
const morgan = require('morgan');

// My error middelware
const logger = require('./middleware/logger'); //General logs

// Build a web server
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')(logger);
require('./startup/config')();
require('./startup/validation')();

app.set('view engine', 'pug');
app.set('views', './views'); //default

process.on('unhandledRejection', (ex) => {
  throw ex;
});

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // HTTP request logger
    debug('Morgan enabeled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { 
    console.log(`Listening on port ${port}...`);
});