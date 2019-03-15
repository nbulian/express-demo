const Joi = require('joi'); // Calss Validator
const mongoose = require('mongoose');

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

exports.CourseModel = CourseModel;
exports.validateCourse = validateCourse;