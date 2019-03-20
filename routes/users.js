const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {UserModel, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validateUser(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);

     let user = await UserModel.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if ( user ) return res.status(400).send('User already registered');
      }      
    });

    user = new UserModel(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();
    
    res.header('x-auth-token', token)
    .send(
      _.pick(user, ['_id', 'name', 'email'])
    );
});

router.get('/', async (req, res) => {
    const sortBy = req.query.sortBy;
    const users = await UserModel.find().select('_id name email').sort(sortBy);
    res.send(users);
});

router.get('/me', auth, async (req, res) => { 
    await UserModel.findById(req.user._id, function (err, user) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if(!user) return res.status(404).send('The user with the given ID was not found.');
        return res.send(user);
      }
    }).select('_id name email'); 
});
router.put('/:id', auth, async (req, res) => {
  const {error} = validateUser(req.body); //Object destructuring > {error} equivalent to result.error
  if ( error ) return res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ _id: req.params.id }, function (err, user) {
    if (err) {
      return res.status(500).send('Something went wrong please try again.');
    } else {
      if(!user) return res.status(404).send('The user with the given ID was not found.');
    }
  });

  const salt = await bcrypt.genSalt(10);

  user.name = req.body.name;
  //user.email = req.body.email;
  user.password = await bcrypt.hash(req.body.password, salt);

  user.save();

  res.send(
    _.pick(user, ['_id', 'name', 'email'])
  );
});

router.delete('/:id', auth, async (req, res) => {
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