const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi'); // Calss Validator
const router = express.Router();

const CourseModel = mongoose.model('Course', new mongoose.Schema({
  name:  {
      type: String,
      require: true,
      minlength: 5,
      maxlength: 50
  }, 
  author:  {
      type: String,
      require: true,
      minlength: 5,
      maxlength: 50
  }, 
  city:  {
      type: String,
      require: true,
      minlength: 5,
      maxlength: 50
  },
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  price: {
    type: Number,
    required: function() { return this.isPublished; },
    min: 5,
    max: 200,
    default: 5,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
}));

router.get('/', async (req, res) => {
  const sortBy = req.query.sortBy;
  const courses = await CourseModel.find().sort(sortBy);
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
  });
});

router.post('/', async (req, res) => {
  const {error} = validateCourse(req.body); //Object destructuring > {error} equivalent to result.error
  if ( error ) return res.status(400).send(error.details[0].message);

  let course = new CourseModel({
    name: req.body.name,
    author: req.body.author, 
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

  await CourseModel.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, course) {
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

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    author: Joi.string().min(5).max(50).required(),
    city: Joi.string().min(5).max(50).required(),
    tags: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean().optional().default(false),
    date: Joi.date(),
    price: Joi.number().optional()
  };
  return Joi.validate(course, schema);    
}

module.exports = router;