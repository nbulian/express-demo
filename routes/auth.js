const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); // Calss Validator
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {UserModel} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);

     let user = await UserModel.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if ( !user ) return res.status(400).send('Invalid email or password.');
      }      
    });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if ( !validPassword ) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ _id: user.id }, config.get('jwtPrivateKey'));

    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(12).required()
    };
    return Joi.validate(req, schema);    
}

module.exports = router;