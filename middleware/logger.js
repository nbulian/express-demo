// winston package to Logging Errors
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logfile.log' }),
      new winston.transports.MongoDB({ 
        db: 'mongodb://localhost/playground',
        level: 'error'
      })
    ]
 });

module.exports = logger;

