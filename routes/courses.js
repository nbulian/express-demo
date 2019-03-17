const {CourseModel, validateCourse} = require('../models/course');
const {AuthorModel} = require('../models/author');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const sortBy = req.query.sortBy;
  const courses = await CourseModel
    .find()
    .populate('author', 'name -_id')
    .sort(sortBy);
  res.send(courses);
});

router.get('/:id', async (req, res) => { 
  await CourseModel.findById(req.params.id, function (err, course) {
    if (err) {
      return res.status(500).send('Something went wrong please try again.');
    } else {
      if(!course) return res.status(404).send('The course with the given ID was not found.');
      return res.send(course);
    }
  })
  .populate('author', 'name -_id');
});

router.post('/', async (req, res) => {
  const {error} = validateCourse(req.body); //Object destructuring > {error} equivalent to result.error
  if ( error ) return res.status(400).send(error.details[0].message);

  const author = await AuthorModel.findById(req.body.authorId);
  if ( !author ) return res.status(400).send('Invalid author.');

  let course = new CourseModel({
    name: req.body.name,
    author: {
      _id: author._id,
      name: author.name
    }, 
    city: req.body.city,
    tags: req.body.tags,
    isPublished: req.body.isPublished,
    date: req.body.date
  });

  course = await course.save();
  res.send(course);
});

router.put('/:id', async (req, res) => {
  const {error} = validateCourse(req.body); //Object destructuring > {error} equivalent to result.error
  if ( error ) return res.status(400).send(error.details[0].message);

  const author = await AuthorModel.findById(req.body.authorId);
  if ( !author ) return res.status(400).send('Invalid author.');

   const update = {
    name: req.body.name,
    author: {
      _id: author._id,
      name: author.name
    },
    city: req.body.city
  }

  await CourseModel.findOneAndUpdate({ _id: req.params.id }, update, function (err, course) {
    if (err) {
      return res.status(500).send('Something went wrong please try again.');
    } else {
      if(!course) return res.status(404).send('The course with the given ID was not found.');
      return res.send(course);
    }
  });
});

router.delete('/:id', async (req, res) => {
  await CourseModel.findOneAndDelete({ _id: req.params.id }, function (err, course) {
    if (err) {
      res.status(404).send('The course with the given ID was not found.');
    } else {
      res.send(course);
    }
  });
});

module.exports = router;