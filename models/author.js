const Joi = require('joi'); // Calss Validator
const mongoose = require('mongoose');

const AuthorModel = mongoose.model('Author', new mongoose.Schema({
    name:  {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50
    }, 
    bio: {
        type: String,
        maxlength: 255
    },
    website:  {
        type: String,
        minlength: 3,
        maxlength: 50
    }, 
}));

function validateAuthor(author) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        bio: Joi.string().max(255),
        website: Joi.string().min(3).max(50)
    };
    return Joi.validate(author, schema);    
}

exports.AuthorModel = AuthorModel;
exports.validateAuthor = validateAuthor;