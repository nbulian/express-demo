const Joi = require('joi'); // Calss Validator
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:  {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50
    }, 
    email: {
        type: String,
        require: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password:  {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }, 
});

const UserModel = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(12).required()
    };
    return Joi.validate(user, schema);    
}

exports.userSchema = userSchema;
exports.UserModel = UserModel;
exports.validateUser = validateUser;