// Dependencies
require('express-async-errors'); //Express Async Errors
const debug = require('debug')('app:startup'); // Debug (npm)
const morgan = require('morgan'); // Morgan (npm)
const logger = require('./middleware/logger'); //My error middelware for general logs

// Build a web server
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')(logger);
require('./startup/config')();
require('./startup/validation')();

app.set('views', './views'); //default

process.on('unhandledRejection', (ex) => {
  throw ex;
});

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // HTTP request logger
    logger.info('Morgan enabeled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { 
  logger.info(`Listening on port ${port}...`);
});