const {AuthorModel, validateAuthor} = require('../models/author');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validateAuthor(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);

    let author = new AuthorModel({
        name: req.body.name,
        bio: req.body.bio, 
        website: req.body.website
    });

    author = await author.save();
    res.send(author);
});

router.get('/', async (req, res) => {
    const sortBy = req.query.sortBy;
    const authors = await AuthorModel.find().sort(sortBy);
    res.send(authors);
});

router.get('/:id', async (req, res) => { 
    await AuthorModel.findById(req.params.id, function (err, author) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if(!author) return res.status(404).send('The author with the given ID was not found.');
        return res.send(author);
      }
    });
});

router.put('/:id', async (req, res) => {
    const {error} = validateAuthor(req.body); //Object destructuring > {error} equivalent to result.error
    if ( error ) return res.status(400).send(error.details[0].message);
  
    await AuthorModel.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, author) {
      if (err) {
        return res.status(500).send('Something went wrong please try again.');
      } else {
        if(!author) return res.status(404).send('The author with the given ID was not found.');
        return res.send(author);
      }
    });
});

router.delete('/:id', async (req, res) => {
    await AuthorModel.findOneAndDelete({ _id: req.params.id }, function (err, author) {
        if (err) {
          return res.status(500).send('Something went wrong please try again.');
        } else {
          if(!author) return res.status(404).send('The author with the given ID was not found.');
          return res.send(author);
        }
    });
});

module.exports = router;