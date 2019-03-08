# Getting Started with Node!
We use Nodejs to build fast and scalable networking applications. It’s a perfect choice for building RESTful services.

* node_modules folders is excluded from the source control. Run the npm update packages to download all the dependencies

> npm update 

## Building RESTful APIs with Express.

1. Build a web server using "express" and listen on port 3000.

We use Nodemon to watch for changes in files and automatically restart the node process.

> nodemon index.js

We use environment variables to store various settings for an application. To read an environment variable, we use process.env. 

> const port = process.env.PORT || 3000;
> app.listen(port);

* We use Joi package to perform input validation. 

2. Define the endpoints

REST defines a set of conventions for creating HTTP services:
 -POST: to create a resource
 Endpoint: http://localhost:3000/api/courses/
 Body:
>{
>    "name": "New Course",
>    "teacher": "Nahuel Bulian",
>    "city": "Florida"
>}

 -PUT: to update it
 Endpoint: http://localhost:3000/api/courses/9
 Body:
>{
>    "name": "New Course updated",
>    "teacher": "Nahuel Bulian",
>    "city": "Buenos Aires"
>}

 -GET: to read it all courses
 Endpoint: http://localhost:3000/api/courses/

 -GET: to read it all courses ordered by name
 http://localhost:3000/api/courses/?sortBy=name

-GET: to read one course by id
 Endpoint: http://localhost:3000/api/courses/9

 -DELETE: to delete it 
 Endpoint: http://localhost:3000/api/courses/9