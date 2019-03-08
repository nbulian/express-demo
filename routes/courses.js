const express = require('express');
const router = express.Router();

const courses = [
    { id : 2, name: 'Course 2', teacher: "Sergio Agüero", city: "Manchester"},
    { id : 1, name: 'Course 1', teacher: "Lionel Messi", city: "Barcelona"},
    { id : 3, name: 'Course 3', teacher: "Paulo Dybala", city: "Turín"},
    { id : 5, name: 'Course 5', teacher: "Ángel Di María", city: "París"},
    { id : 4, name: 'Course 4', teacher: "Nicolás Tagliafico", city: "Amsterdam"},
    { id : 6, name: 'Course 6', teacher: "Maximiliano Meza", city: "Monterrey"},
    { id : 8, name: 'Course 8', teacher: "Ezequiel Barco", city: "Atlanta"},
    { id : 7, name: 'Course 7', teacher: "Emiliano Rigoni", city: "San Petersburgo"},
];

router.get('/', (req, res) => {
    // To read query string parameters (?sortBy=name)
    const sortBy = req.query.sortBy; // Return the courses  
    
    if ( sortBy ) {
      courses.sort(dynamicSort(sortBy));
    }

    res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course was not found.');
  res.send(course);
});

router.post('/', (req, res) => {

  const {error} = validateCourse(req.body); //Object destructuring > {error} equivalent to result.error

  if ( error ) return res.status(400).send(error.details[0].message);

  const course = {
      id: courses.length + 1,
      name: req.body.name,
      teacher: req.body.teacher,
      city: req.body.city
  };
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course was not found.');

  const {error} = validateCourse(req.body); //Object destructuring > {error} equivalent to result.error
  if ( error ) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  course.teacher = req.body.teacher;
  course.city = req.body.city;

  res.send(course);
});

router.delete('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course was not found.');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = {
      name: Joi.string().min(3).required(),
      teacher: Joi.string().min(3).required(),
      city: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);    
}

//https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
function dynamicSort(property) {
  var sortOrder = 1;

  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }

  return function (a,b) {
      if(sortOrder == -1){
          return b[property].localeCompare(a[property]);
      }else{
          return a[property].localeCompare(b[property]);
      }        
  }
}

module.exports = router;