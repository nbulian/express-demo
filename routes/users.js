const _ = require('lodash');
const {UserModel, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validateUser(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);

    UserModel.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if ( user ) return res.status(400).send('User already registered');

        user = new UserModel(_.pick(req.body, ['name', 'email', 'password']));

        user.save();

        res.send(
          _.pick(user, ['_id', 'name', 'email'])
        );
      }      
    });
});

router.get('/', async (req, res) => {
    const sortBy = req.query.sortBy;
    const users = await UserModel.find().sort(sortBy);
    res.send(users);
});

router.get('/:id', async (req, res) => { 
    await UserModel.findById(req.params.id, function (err, user) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if(!user) return res.status(404).send('The user with the given ID was not found.');
        return res.send(user);
      }
    });
});

router.put('/:id', async (req, res) => {
    const {error} = validateUser(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);
  
    await UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, author) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if(!user) return res.status(404).send('The user with the given ID was not found.');
        return res.send(user);
      }
    });
});

router.delete('/:id', async (req, res) => {
    await UserModel.findOneAndDelete({ _id: req.params.id }, function (err, user) {
        if (err) {
          return res.status(500).send('Something went wrong please try again.');
        } else {
          if(!user) return res.status(404).send('The user with the given ID was not found.');
          return res.send(user);
        }
    });
});

module.exports = router;