// winston package to Logging Errors
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logfile.log' })
    ]
 });

module.exports = function(err, req, res, next){
    logger.error(err.message, err);
    res.status(500).send('Something failed.');
}