const express = require('express');
const coursesRoutes = require('../routes/courses');
const authorsRoutes = require('../routes/authors');
const usersRoutes = require('../routes/users');
const authRoutes = require('../routes/auth');
const home = require('../routes/home');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json()); // Builtin middelware who parse the request body to json > req.body
    app.use(express.urlencoded( { extended: true } )); // Built-in middleware who convert this key=value&key=value into a json object
    app.use(express.static('public')); // Built-in middleware who published the static content in "public" folder
    app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
    app.use('/api/courses', coursesRoutes); // Routes for /api/courses
    app.use('/api/authors', authorsRoutes); // Routes for /api/authors
    app.use('/api/users', usersRoutes); // Routes for /api/users
    app.use('/api/auth', authRoutes); // Routes for /api/auth
    app.use('/', home); // Routes for
    app.use(error);
}