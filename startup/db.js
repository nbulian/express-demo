const mongoose = require('mongoose');

module.exports = function(logger) {
    mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => logger.info('Connected to MongoDB...'));
}